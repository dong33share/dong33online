// Bản đang chạy trong Apps Script của Sheet "Đăng ký 15 phút – dong33.online".
// Mỗi lượt đăng ký: ghi 1 dòng vào tab "Dang ky" và gửi email báo về NOTIFY_EMAIL.
// Web đọc link video giới thiệu từ ô B1 của tab "Cau hinh".
const SHEET_NAME = 'Dang ky';
const CONFIG_SHEET = 'Cau hinh';
const NOTIFY_EMAIL = 'cskh@trambaohiem.com';

function doPost(e) {
  const sheet = getSheet_();
  const p = e.parameter;
  sheet.appendRow([new Date(), p.name || '', "'" + (p.phone || ''), p.facebook || '', p.page || '']);
  try { notify_(p); } catch (err) { console.error(err); }
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

// Web gọi GET để lấy link video giới thiệu ở ô B1, tab "Cau hinh"
function doGet() {
  const video = String(getConfigSheet_().getRange('B1').getValue() || '').trim();
  return ContentService.createTextOutput(JSON.stringify({ video: video })).setMimeType(ContentService.MimeType.JSON);
}

function notify_(p) {
  const body = 'Có người vừa đăng ký trò chuyện 15 phút trên dong33.online:\n\n'
    + 'Họ tên: ' + (p.name || '') + '\n'
    + 'Số điện thoại: ' + (p.phone || '') + '\n'
    + 'Facebook: ' + (p.facebook || '') + '\n'
    + 'Trang: ' + (p.page || '') + '\n\n'
    + 'Danh sách đầy đủ: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
  MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: '[dong33.online] Đăng ký mới: ' + (p.name || '') + ' · ' + (p.phone || ''), body: body });
}

function getSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(['Thời gian', 'Họ tên', 'Số điện thoại', 'Facebook', 'Trang']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getConfigSheet_() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let s = book.getSheetByName(CONFIG_SHEET);
  if (!s) {
    s = book.insertSheet(CONFIG_SHEET);
    s.getRange('A1:B1').setValues([['Link video giới thiệu (YouTube)', '']]);
    s.getRange('A2').setValue('Dán link YouTube vào ô B1. Để trống = trang hiện "Video giới thiệu sắp có".');
    s.getRange('A1').setFontWeight('bold');
    s.setColumnWidth(1, 260);
    s.setColumnWidth(2, 460);
  }
  return s;
}
