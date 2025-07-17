import Report from '../models/reports.js';
import { getConfig } from '../server.js';
// Create a new report
export const createReport = async (req, res) => {
  try {
    const { name, pdfReportType, price, description, divineReportType, isActive } = req.body;

    // Validate required fields
    if (!name || !pdfReportType || !price || !description || !divineReportType) {
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

    // Validate PDF report type
    const validPdfReportTypes = ['Vedic Reports', 'Natal Report', 'Natal Couple Report', 'Prediction Report', 'Numerology Report'];
    if (!validPdfReportTypes.includes(pdfReportType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF report type. Must be one of: Vedic Reports, Natal Report, Natal Couple Report, Prediction Report, Numerology Report'
      });
    }

    // Check if report with same name already exists
    const existingReport = await Report.findOne({ name: name.trim() });
    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: 'A report with this name already exists'
      });
    }

    const report = new Report({
      name: name.trim(),
      pdfReportType,
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
    const { pdfReportType, isActive, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = {};
    if (pdfReportType) filter.pdfReportType = pdfReportType;
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
    const { name, pdfReportType, price, description, divineReportType, isActive } = req.body;

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
          return res.status(409).json({
            success: false,
            message: 'A report with this name already exists'
          });
        }
      }
      updateData.name = name.trim();
    }
    
    if (pdfReportType !== undefined) {
      // Validate PDF report type
      const validPdfReportTypes = ['Vedic Reports', 'Natal Report', 'Natal Couple Report', 'Prediction Report', 'Numerology Report'];
      if (!validPdfReportTypes.includes(pdfReportType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid PDF report type. Must be one of: Vedic Reports, Natal Report, Natal Couple Report, Prediction Report, Numerology Report'
        });
      }
      updateData.pdfReportType = pdfReportType;
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

// Generate Divine PDF Report
export const generateDivineReport = async (req, res) => {
  try {
    const {
      fullName,
      email,
      dateOfBirth,
      location,
      latitude,
      longitude,
      language = 'en',
      reportId,
      reportName,
      reportPrice,
      divineReportType,
      gender,
      timeOfBirth
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !dateOfBirth || !location || !reportId || !divineReportType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: fullName, email, dateOfBirth, location, reportId, divineReportType'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate date of birth format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth must be in YYYY-MM-DD format'
      });
    }

    // Parse date of birth
    const birthDate = new Date(dateOfBirth);
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1; // getMonth() returns 0-11
    const year = birthDate.getFullYear();

    // Parse time of birth (HH:MM format)
    let hour = 12, min = 0, sec = 0;
    if (timeOfBirth) {
      const timeMatch = timeOfBirth.match(/^(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        hour = parseInt(timeMatch[1]);
        min = parseInt(timeMatch[2]);
      }
    }

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Validate gender
    if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Gender must be male, female, or other'
      });
    }

    // Get timezone offset (assuming IST for India)
    const tzone = 5.5;
    const config = await getConfig();
    console.log("config",config);
    // Prepare data for Divine API
    const formData = {
      api_key: config.divineApiKey,
      full_name: fullName,
      day: day,
      month: month,
      year: year,
      hour: hour,
      min: min,
      sec: sec,
      gender: gender.toLowerCase(),
      place: location,
      lat: parseFloat(latitude),
      lon: parseFloat(longitude),
      tzone: tzone,
      lan: language,
      company_name: config.companyName,
      company_url: config.companyUrl || 'https://synilogictech.com',
      company_email: config.companyEmail,
      company_mobile: config.companyPhone,
      company_bio: config.company_bio,
      logo_url: config.companyLogo,
      footer_text: config.reportFooterText
    };

    // Use the correct API endpoint from the report's divineReportType
    const apiEndpoint = divineReportType;

    console.log('Calling Divine API with endpoint:', apiEndpoint);
    console.log('Form data:', formData);

    // Call Divine API to generate PDF
    const divineResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.divineApiTokenBearer}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (!divineResponse.ok) {
      const errorText = await divineResponse.text();
      console.error('Divine API error response:', errorText);
      throw new Error(`Divine API returned ${divineResponse.status}: ${errorText}`);
    }

    const divineResult = await divineResponse.json();
    console.log('Divine API response:', divineResult);

    if (!divineResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to generate report from Divine API',
        error: divineResult.message || 'Unknown error from Divine API'
      });
    }

    // Get the PDF URL from Divine API response
    const pdfUrl = divineResult.data?.report_url;
    const downloadUrl = divineResult.data?.download_url;

    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'No PDF URL received from Divine API'
      });
    }

    // Send email with PDF link
    try {
      const createTransporter = (await import('../Middleware/nodeMailer.js')).default;
      const transporter = await createTransporter();

      const mailOptions = {
        from: config.companyEmail,
        to: email,
        subject: `Your ${reportName} Report is Ready`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0;">${config.companyName}</h1>
              <p style="margin: 10px 0 0 0;">Your Astrology Report</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${fullName},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Your <strong>${reportName}</strong> report has been successfully generated based on your birth details.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="color: #333; margin-top: 0;">Report Details:</h3>
                <p><strong>Report Type:</strong> ${reportName}</p>
                <p><strong>Price:</strong> ₹${reportPrice}</p>
                <p><strong>Generated On:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${pdfUrl}" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  📄 View Your Report
                </a>
              </div>
              
              ${downloadUrl ? `
              <div style="text-align: center; margin: 20px 0;">
                <a href="${downloadUrl}" 
                   style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 20px; display: inline-block; font-weight: bold;">
                  ⬇️ Download PDF
                </a>
              </div>
              ` : ''}
              
              <p style="color: #666; line-height: 1.6; margin-top: 30px;">
                This report is generated by our expert astrologers based on Vedic astrology principles. 
                If you have any questions or need clarification, please don't hesitate to contact us.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong>${config.companyName} Team</strong><br>
                  <a href="mailto:${config.companyEmail}" style="color: #667eea;">${config.companyEmail}</a>
                </p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', email);

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the entire request if email fails, just log it
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Report generated successfully',
      data: {
        reportName,
        reportPrice,
        pdfUrl,
        downloadUrl,
        email,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Generate Divine report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report. Please try again.',
      error: error.message
    });
  }
};
