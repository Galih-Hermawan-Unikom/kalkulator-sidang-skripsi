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
    el('nilai_ketua').textContent = fmt2(calcRataKetua(state));
    el('nilai_p1').textContent = fmt2(calcRataP1(state));
    el('nilai_p2').textContent = fmt2(calcRataP2(state));
    el('nilai_bimbingan').textContent = fmt2(calcBimbingan(state));

    const totalSidang = calcTotalSidang(state);
    const nilaiAkhir = calcNilaiAkhir(state);

    el('total_sidang').textContent = fmt2(totalSidang);
    el('nilai_akhir').textContent = fmt2(nilaiAkhir);
    el('grade').textContent = toGrade(nilaiAkhir);
  }

  function bindNumber(id, path) {
    const input = el(id);
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
      bobot: {
        antar_penguji: { ketua: 0.425, p1: 0.425, p2: 0.15 },
        akhir: { seminar: 0.30, sidang: 0.40, bimbingan: 0.30 }
      }
    };
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

  document.addEventListener('DOMContentLoaded', init);
})();
