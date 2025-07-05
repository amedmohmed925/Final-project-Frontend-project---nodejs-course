const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateCertificatePdf({ studentName, courseTitle, outputPath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // خلفية
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f5f7fa');

    // لوجو المنصة (ضع مسار اللوجو الصحيح)
    try {
      doc.image(path.join(__dirname, '../public/logo.png'), 50, 40, { width: 120 });
    } catch (e) {
      // إذا لم يوجد لوجو تجاهل الخطأ
    }

    // عنوان الشهادة
    doc.fontSize(40).fillColor('#0d6efd').text('شهادة إتمام كورس', { align: 'center', valign: 'center' });

    // اسم الطالب
    doc.moveDown(2);
    doc.fontSize(28).fillColor('#222').text(`تشهد منصة EduQest أن الطالب:`, { align: 'center' });
    doc.fontSize(32).fillColor('#0d6efd').text(studentName, { align: 'center' });

    // اسم الكورس
    doc.moveDown(1);
    doc.fontSize(24).fillColor('#222').text(`قد أكمل بنجاح كورس:`, { align: 'center' });
    doc.fontSize(28).fillColor('#0d6efd').text(courseTitle, { align: 'center' });

    // تاريخ الإصدار
    doc.moveDown(2);
    doc.fontSize(18).fillColor('#555').text(`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}`, { align: 'center' });

    // ختم أو توقيع (اختياري)
    // doc.image(path.join(__dirname, '../public/stamp.png'), doc.page.width - 200, doc.page.height - 150, { width: 120 });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = generateCertificatePdf;
