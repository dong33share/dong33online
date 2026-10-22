// Shared lead helpers for the dong33.online funnel.
// SHEET_WEBHOOK saves every lead (with name + summary) to the same Google Sheet as the /about form.
// QUIZ_EMAIL_WEBHOOK is the "Quiz Quỹ Dự Phòng" Apps Script that emails cskh@trambaohiem.com.
// Both are Apps Script web apps answering with opaque no-cors responses, so receipt cannot be confirmed here.
window.Dong33Lead = (() => {
  const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbz-1mcONnWGtDIkVCeoq77RY5ExOqxUqBX8vvn35pRDStqRZfeQEZHig3X0kxt6SX1q/exec';
  const QUIZ_EMAIL_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxGGIIydZ1lLAkm3lLp3ik0PFbJmlxkJa584YsUTR3tUxNygT4hlaqwjuyUuOXIzYFBUA/exec';

  function device() {
    return window.innerWidth < 768 ? 'Mobile' : window.innerWidth < 1024 ? 'Tablet' : 'Desktop';
  }

  function validPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return /^\+?[\d\s().-]+$/.test(phone) && digits.length >= 9 && digits.length <= 15;
  }

  // lead: {name, phone, goal, note, source}; quizPayload: optional JSON for the email webhook.
  async function send(lead, quizPayload) {
    const sheet = fetch(SHEET_WEBHOOK, {
      method: 'POST', mode: 'no-cors',
      body: new URLSearchParams({...lead, device: device(), page: location.href, submittedAt: new Date().toISOString()})
    });
    const jobs = [sheet];
    if (quizPayload) {
      jobs.push(fetch(QUIZ_EMAIL_WEBHOOK, {method: 'POST', mode: 'no-cors', body: JSON.stringify(quizPayload)}).catch(() => {}));
    }
    // The sheet request decides success; the email copy is best effort.
    await Promise.all(jobs);
  }

  // Keeps the last two words of short copy together so no word sits alone on a line.
  function noOrphans(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let last = null;
      while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) last = walker.currentNode;
      if (last) last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, ' $1');
    });
  }

  return {send, validPhone, noOrphans};
})();
