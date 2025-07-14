import Report from '../models/reports.js';

// Create a new report
export const createReport = async (req, res) => {
  try {
    const { name, type, price, description, divineReportType, isActive } = req.body;

    // Validate required fields
    if (!name || !type || !price || !description || !divineReportType) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // Validate report type
    const validTypes = ['Basic', 'Sampoorna', 'Ananta', 'Match Making'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report type. Must be one of: Basic, Sampoorna, Ananta, Match Making'
      });
    }

    // Check if report with same name already exists
    const existingReport = await Report.findOne({ name: name.trim() });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'A report with this name already exists'
      });
    }

    const report = new Report({
      name: name.trim(),
      type,
      price,
      description: description.trim(),
      divineReportType: divineReportType.trim(),
      isActive: isActive !== undefined ? isActive : true
    });

    const savedReport = await report.save();

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: savedReport
    });

  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all reports with optional filtering
export const getAllReports = async (req, res) => {
  try {
    const { type, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get reports with pagination
    const reports = await Report.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalReports = await Report.countDocuments(filter);
    const totalPages = Math.ceil(totalReports / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Reports retrieved successfully',
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalReports,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get all reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get a single report by ID
export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report retrieved successfully',
      data: report
    });

  } catch (error) {
    console.error('Get report by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, price, description, divineReportType, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    // Check if report exists
    const existingReport = await Report.findById(id);
    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) {
      // Check if new name conflicts with existing report
      if (name.trim() !== existingReport.name) {
        const nameConflict = await Report.findOne({ 
          name: name.trim(), 
          _id: { $ne: id } 
        });
        if (nameConflict) {
          return res.status(400).json({
            success: false,
            message: 'A report with this name already exists'
          });
        }
      }
      updateData.name = name.trim();
    }
    if (type !== undefined) {
      const validTypes = ['Basic', 'Sampoorna', 'Ananta', 'Match Making'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid report type. Must be one of: Basic, Sampoorna, Ananta, Match Making'
        });
      }
      updateData.type = type;
    }
    if (price !== undefined) {
      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a positive number'
        });
      }
      updateData.price = price;
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }
    if (divineReportType !== undefined) {
      updateData.divineReportType = divineReportType.trim();
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport
    });

  } catch (error) {
    console.error('Update report error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Delete report error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Toggle report active status
export const toggleReportStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Report ID is required'
      });
    }

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.isActive = !report.isActive;
    const updatedReport = await report.save();

    res.status(200).json({
      success: true,
      message: `Report ${updatedReport.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updatedReport
    });

  } catch (error) {
    console.error('Toggle report status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get active reports only
export const getActiveReports = async (req, res) => {
  try {
    const reports = await Report.find({ isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Active reports retrieved successfully',
      data: reports
    });

  } catch (error) {
    console.error('Get active reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Bulk operations
export const bulkUpdateReports = async (req, res) => {
  try {
    const { reports } = req.body;

    if (!reports || !Array.isArray(reports)) {
      return res.status(400).json({
        success: false,
        message: 'Reports array is required'
      });
    }

    const updatePromises = reports.map(async (report) => {
      const { id, ...updateData } = report;
      return Report.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    });

    const updatedReports = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Reports updated successfully',
      data: updatedReports
    });

  } catch (error) {
    console.error('Bulk update reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
