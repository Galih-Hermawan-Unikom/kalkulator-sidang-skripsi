(function() {
  'use strict';

  // Weights as per Excel template
  const W = {
    ketua: { presentasi: 0.20, materi: 0.30, penulisan: 0.15, hasil: 0.35 },
    p1:    { presentasi: 0.20, materi: 0.30, penulisan: 0.15, hasil: 0.35 },
    p2:    { cara: 0.30, kecepatan: 0.30, ketepatan: 0.40 },
    bimbingan: { ketepatan: 0.40, ketekunan: 0.30, tingkahlaku: 0.30 },
    ringkasan: { seminar: 0.30, sidang: 0.40, bimbingan: 0.30 },
    antarPenguji: { ketua: 0.425, p1: 0.425, p2: 0.15 },
  };

  // Elements
  const el = id => document.getElementById(id);

  const state = {
    ketua: { presentasi: 0, materi: 0, penulisan: 0, hasil: 0 },
    p1:    { presentasi: 0, materi: 0, penulisan: 0, hasil: 0 },
    p2:    { cara: 0, kecepatan: 0, ketepatan: 0 },
    bimbingan: { ketepatan: 0, ketekunan: 0, tingkahlaku: 0 },
    seminar: 0,
  };

  function clamp100(x) {
    x = Number(x || 0);
    if (isNaN(x)) return 0;
    return Math.max(0, Math.min(100, x));
  }

  function calcRataKetua(s) {
    const {presentasi, materi, penulisan, hasil} = s.ketua;
    return presentasi*W.ketua.presentasi + materi*W.ketua.materi + penulisan*W.ketua.penulisan + hasil*W.ketua.hasil;
  }
  function calcRataP1(s) {
    const {presentasi, materi, penulisan, hasil} = s.p1;
    return presentasi*W.p1.presentasi + materi*W.p1.materi + penulisan*W.p1.penulisan + hasil*W.p1.hasil;
  }
  function calcRataP2(s) {
    const {cara, kecepatan, ketepatan} = s.p2;
    return cara*W.p2.cara + kecepatan*W.p2.kecepatan + ketepatan*W.p2.ketepatan;
  }
  function calcBimbingan(s) {
    const {ketepatan, ketekunan, tingkahlaku} = s.bimbingan;
    return ketepatan*W.bimbingan.ketepatan + ketekunan*W.bimbingan.ketekunan + tingkahlaku*W.bimbingan.tingkahlaku;
  }

  function calcTotalSidang(s) {
    const ketua = calcRataKetua(s);
    const p1 = calcRataP1(s);
    const p2 = calcRataP2(s);
    return ketua*W.antarPenguji.ketua + p1*W.antarPenguji.p1 + p2*W.antarPenguji.p2;
  }

  function calcNilaiAkhir(s) {
    const seminar = s.seminar;
    const sidang = calcTotalSidang(s);
    const bimbingan = calcBimbingan(s);
    return seminar*W.ringkasan.seminar + sidang*W.ringkasan.sidang + bimbingan*W.ringkasan.bimbingan;
  }

  function toGrade(x) {
    if (x >= 80) return 'A';
    if (x >= 70) return 'B';
    if (x >= 60) return 'C';
    return 'E';
  }

  function fmt2(x) { return (Number(x)||0).toFixed(2); }

  function render() {
    const nilaiKetuaEl = el('nilai_ketua');
    const nilaiP1El = el('nilai_p1');
    const nilaiP2El = el('nilai_p2');
    const nilaiBimEl = el('nilai_bimbingan');
    const totalSidangEl = el('total_sidang');
    const nilaiAkhirEl = el('nilai_akhir');
    const gradeEl = el('grade');

    if (!nilaiKetuaEl || !nilaiP1El || !nilaiP2El || !nilaiBimEl || !totalSidangEl || !nilaiAkhirEl || !gradeEl) {
      return;
    }

    nilaiKetuaEl.textContent = fmt2(calcRataKetua(state));
    nilaiP1El.textContent = fmt2(calcRataP1(state));
    nilaiP2El.textContent = fmt2(calcRataP2(state));
    nilaiBimEl.textContent = fmt2(calcBimbingan(state));

    const totalSidang = calcTotalSidang(state);
    const nilaiAkhir = calcNilaiAkhir(state);

    totalSidangEl.textContent = fmt2(totalSidang);
    nilaiAkhirEl.textContent = fmt2(nilaiAkhir);
    gradeEl.textContent = toGrade(nilaiAkhir);
  }

  function bindNumber(id, path) {
    const input = el(id);
    if (!input) return;
    input.addEventListener('input', () => {
      // clamp input value and update state
      input.value = input.value === '' ? '' : clamp100(input.value);
      let ref = state;
      for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
      ref[path[path.length - 1]] = Number(input.value || 0);
      render();
    });
  }

  function collect() {
    const nilai_ketua = calcRataKetua(state);
    const nilai_p1 = calcRataP1(state);
    const nilai_p2 = calcRataP2(state);
    const nilai_bimbingan = calcBimbingan(state);
    const total_sidang = calcTotalSidang(state);
    const nilai_akhir = calcNilaiAkhir(state);
    const grade = toGrade(nilai_akhir);

    return {
      nilai_ketua, nilai_p1, nilai_p2,
      nilai_bimbingan, total_sidang, nilai_akhir, grade,
      seminar: state.seminar,
      kontribusi_sidang: {
        ketua: nilai_ketua * W.antarPenguji.ketua,
        p1: nilai_p1 * W.antarPenguji.p1,
        p2: nilai_p2 * W.antarPenguji.p2,
      },
      kontribusi_ringkasan: {
        seminar: state.seminar * W.ringkasan.seminar,
        sidang: total_sidang * W.ringkasan.sidang,
        bimbingan: nilai_bimbingan * W.ringkasan.bimbingan,
      },
      bobot: {
        antar_penguji: { ketua: 0.425, p1: 0.425, p2: 0.15 },
        akhir: { seminar: 0.30, sidang: 0.40, bimbingan: 0.30 }
      }
    };
  }

  const SIMULASI_C_VALUES = [
    { id: 'ketua_presentasi', value: 70 },
    { id: 'ketua_materi', value: 70 },
    { id: 'ketua_penulisan', value: 70 },
    { id: 'ketua_hasil', value: 70 },
    { id: 'p1_presentasi', value: 75 },
    { id: 'p1_materi', value: 75 },
    { id: 'p1_penulisan', value: 75 },
    { id: 'p1_hasil', value: 75 },
    { id: 'p2_cara', value: 70 },
    { id: 'p2_kecepatan', value: 70 },
    { id: 'p2_ketepatan', value: 70 },
    { id: 'bim_ketepatan', value: 75 },
    { id: 'bim_ketekunan', value: 75 },
    { id: 'bim_tingkahlaku', value: 75 },
    { id: 'nilai_seminar', value: 60 }
  ];

  function buildPreviewMarkup(data) {
    const fmt = fmt2;
    const fmtPercent = weight => `${fmt(weight * 100)}%`;

    return `
      <div class="preview-section">
        <h3>Rekap Nilai Sidang</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Nilai Ketua Penguji</th>
              <th>Nilai Penguji 1</th>
              <th>Nilai Penguji 2</th>
              <th>Total Nilai Sidang</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${fmt(data.nilai_ketua)}</td>
              <td>${fmt(data.nilai_p1)}</td>
              <td>${fmt(data.nilai_p2)}</td>
              <td>${fmt(data.total_sidang)}</td>
            </tr>
            <tr>
              <td>${fmtPercent(data.bobot.antar_penguji.ketua)}</td>
              <td>${fmtPercent(data.bobot.antar_penguji.p1)}</td>
              <td>${fmtPercent(data.bobot.antar_penguji.p2)}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>${fmt(data.kontribusi_sidang.ketua)}</td>
              <td>${fmt(data.kontribusi_sidang.p1)}</td>
              <td>${fmt(data.kontribusi_sidang.p2)}</td>
              <td>${fmt(data.total_sidang)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="preview-section">
        <h3>Nilai Akhir</h3>
        <table class="preview-table">
          <thead>
            <tr>
              <th>Nilai Seminar</th>
              <th>Nilai Sidang</th>
              <th>Nilai Bimbingan</th>
              <th>Total Nilai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${fmt(data.seminar)}</td>
              <td>${fmt(data.total_sidang)}</td>
              <td>${fmt(data.nilai_bimbingan)}</td>
              <td>${fmt(data.nilai_akhir)}</td>
            </tr>
            <tr>
              <td>${fmtPercent(data.bobot.akhir.seminar)}</td>
              <td>${fmtPercent(data.bobot.akhir.sidang)}</td>
              <td>${fmtPercent(data.bobot.akhir.bimbingan)}</td>
              <td>-</td>
            </tr>
            <tr>
              <td>${fmt(data.kontribusi_ringkasan.seminar)}</td>
              <td>${fmt(data.kontribusi_ringkasan.sidang)}</td>
              <td>${fmt(data.kontribusi_ringkasan.bimbingan)}</td>
              <td>${fmt(data.nilai_akhir)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="preview-grade">
        <span>Grade</span>
        <strong>${data.grade}</strong>
      </div>
    `;
  }

  let lastFocusedElement = null;

  function setInputValue(id, value) {
    const input = el(id);
    if (!input) return;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function simulateGradeC() {
    SIMULASI_C_VALUES.forEach(({ id, value }) => setInputValue(id, value));
  }

  function showPreview() {
    const overlay = el('preview_overlay');
    const content = el('preview_content');
    if (!overlay || !content) return;

    const data = collect();
    content.innerHTML = buildPreviewMarkup(data);

    overlay.classList.add('show');
    overlay.hidden = false;

    const closeBtn = el('preview_close');
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (closeBtn) closeBtn.focus();
  }

  function hidePreview() {
    const overlay = el('preview_overlay');
    if (!overlay) return;
    overlay.classList.remove('show');
    overlay.hidden = true;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  function init() {
    // Ketua
    bindNumber('ketua_presentasi', ['ketua','presentasi']);
    bindNumber('ketua_materi', ['ketua','materi']);
    bindNumber('ketua_penulisan', ['ketua','penulisan']);
    bindNumber('ketua_hasil', ['ketua','hasil']);

    // Penguji 1
    bindNumber('p1_presentasi', ['p1','presentasi']);
    bindNumber('p1_materi', ['p1','materi']);
    bindNumber('p1_penulisan', ['p1','penulisan']);
    bindNumber('p1_hasil', ['p1','hasil']);

    // Penguji 2
    bindNumber('p2_cara', ['p2','cara']);
    bindNumber('p2_kecepatan', ['p2','kecepatan']);
    bindNumber('p2_ketepatan', ['p2','ketepatan']);

    // Bimbingan
    bindNumber('bim_ketepatan', ['bimbingan','ketepatan']);
    bindNumber('bim_ketekunan', ['bimbingan','ketekunan']);
    bindNumber('bim_tingkahlaku', ['bimbingan','tingkahlaku']);

    // Seminar
    bindNumber('nilai_seminar', ['seminar']);

    render();

    const previewButton = el('preview_button');
    const previewClose = el('preview_close');
    const previewOverlay = el('preview_overlay');
    const simulateButton = el('simulate_c');

    if (previewButton) previewButton.addEventListener('click', showPreview);
    if (previewClose) previewClose.addEventListener('click', hidePreview);
    if (previewOverlay) {
      previewOverlay.addEventListener('click', event => {
        if (event.target === previewOverlay) hidePreview();
      });
    }
    if (simulateButton) simulateButton.addEventListener('click', simulateGradeC);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && previewOverlay && previewOverlay.classList.contains('show')) {
        hidePreview();
      }
    });

    // Set last updated date in Indonesian
    const target = document.getElementById('last_updated');
    if (target) {
      const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      const d = new Date();
      const s = `${hari[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
      target.textContent = s;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
