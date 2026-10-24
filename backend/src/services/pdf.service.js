const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../../reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const SEVERITY_COLORS = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#65a30d',
  info: '#2563eb',
};

const renderIssueSection = (doc, title, issues) => {
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor('#111827').font('Helvetica-Bold').text(title);
  doc.moveDown(0.3);

  if (!issues || issues.length === 0) {
    doc.fontSize(10).font('Helvetica').fillColor('#6b7280').text('No issues found.');
    return;
  }

  issues.forEach((issue, idx) => {
    const color = SEVERITY_COLORS[issue.severity] || '#374151';
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor(color)
      .text(`${idx + 1}. [${(issue.severity || 'info').toUpperCase()}] ${issue.title}`);
    doc.fontSize(10).font('Helvetica').fillColor('#374151').text(issue.description || '', { indent: 10 });
    if (issue.line) {
      doc.fontSize(9).fillColor('#6b7280').text(`Line: ${issue.line}`, { indent: 10 });
    }
    if (issue.suggestion || issue.fix) {
      doc
        .fontSize(9)
        .fillColor('#059669')
        .text(`Suggestion: ${issue.suggestion || issue.fix}`, { indent: 10 });
    }
    doc.moveDown(0.4);
  });
};

const generateReviewPDF = (review) => {
  return new Promise((resolve, reject) => {
    const fileName = `review-${review._id}-${Date.now()}.pdf`;
    const filePath = path.join(REPORTS_DIR, fileName);
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#4f46e5')
      .text('CodeView AI - Code Review Report', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#6b7280')
      .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.text(`Language: ${review.language}`, { align: 'center' });
    doc.moveDown(1);

    // Score
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#111827')
      .text(`Overall Score: ${review.result.overallScore}/100`);
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica').fillColor('#374151').text(review.result.summary || '');
    doc.moveDown(0.5);

    // Complexity
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Complexity Analysis');
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#374151')
      .text(`Time Complexity: ${review.result.complexity?.time || 'N/A'}`);
    doc.text(`Space Complexity: ${review.result.complexity?.space || 'N/A'}`);
    if (review.result.complexity?.explanation) {
      doc.text(`Explanation: ${review.result.complexity.explanation}`);
    }

    // Issues
    renderIssueSection(doc, 'Bug Analysis', review.result.bugs);
    renderIssueSection(doc, 'Security Issues', review.result.securityIssues);
    renderIssueSection(doc, 'Performance Issues', review.result.performanceIssues);
    renderIssueSection(doc, 'Readability Issues', review.result.readabilityIssues);

    // Maintainability
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Maintainability');
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#374151')
      .text(`Score: ${review.result.maintainability?.score || 0}/100`);
    doc.text(review.result.maintainability?.analysis || review.result.maintainability?.comments || '');

    // Best Practices
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Best Practice Suggestions');
    doc.moveDown(0.3);
    (review.result.bestPractices || []).forEach((bp, idx) => {
      doc.fontSize(10).font('Helvetica').fillColor('#374151').text(`${idx + 1}. ${bp}`);
    });

    // Refactored Code
    doc.addPage();
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#111827').text('Refactored Code');
    doc.moveDown(0.3);
    doc
      .fontSize(8)
      .font('Courier')
      .fillColor('#111827')
      .text(review.result.refactoredCode || 'N/A', { lineGap: 2 });

    // Alternative Approach
    if (review.result.alternativeApproach?.code) {
      doc.addPage();
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#111827')
        .text(`Alternative Approach: ${review.result.alternativeApproach.title || ''}`);
      doc.moveDown(0.3);
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#374151')
        .text(review.result.alternativeApproach.description || '');
      doc.moveDown(0.3);
      doc
        .fontSize(8)
        .font('Courier')
        .fillColor('#111827')
        .text(review.result.alternativeApproach.code, { lineGap: 2 });
    }

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = { generateReviewPDF, REPORTS_DIR };