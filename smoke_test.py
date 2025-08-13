# Quick smoke test to compare JS logic with Python re-implementation
# We re-implement the same formulas used in assets/app.js to validate sample inputs.

W = {
    'ketua': {'presentasi': 0.20, 'materi': 0.30, 'penulisan': 0.15, 'hasil': 0.35},
    'p1':    {'presentasi': 0.20, 'materi': 0.30, 'penulisan': 0.15, 'hasil': 0.35},
    'p2':    {'cara': 0.30, 'kecepatan': 0.30, 'ketepatan': 0.40},
    'bimbingan': {'ketepatan': 0.40, 'ketekunan': 0.30, 'tingkahlaku': 0.30},
    'ringkasan': {'seminar': 0.30, 'sidang': 0.40, 'bimbingan': 0.30},
    'antarPenguji': {'ketua': 0.425, 'p1': 0.425, 'p2': 0.15},
}


def calc_ketua(s):
    k = s['ketua']
    return k['presentasi']*W['ketua']['presentasi'] + k['materi']*W['ketua']['materi'] + k['penulisan']*W['ketua']['penulisan'] + k['hasil']*W['ketua']['hasil']

def calc_p1(s):
    k = s['p1']
    return k['presentasi']*W['p1']['presentasi'] + k['materi']*W['p1']['materi'] + k['penulisan']*W['p1']['penulisan'] + k['hasil']*W['p1']['hasil']

def calc_p2(s):
    k = s['p2']
    return k['cara']*W['p2']['cara'] + k['kecepatan']*W['p2']['kecepatan'] + k['ketepatan']*W['p2']['ketepatan']

def calc_bimbingan(s):
    k = s['bimbingan']
    return k['ketepatan']*W['bimbingan']['ketepatan'] + k['ketekunan']*W['bimbingan']['ketekunan'] + k['tingkahlaku']*W['bimbingan']['tingkahlaku']

def calc_sidang(s):
    return calc_ketua(s)*W['antarPenguji']['ketua'] + calc_p1(s)*W['antarPenguji']['p1'] + calc_p2(s)*W['antarPenguji']['p2']

def calc_final(s):
    return s['seminar']*W['ringkasan']['seminar'] + calc_sidang(s)*W['ringkasan']['sidang'] + calc_bimbingan(s)*W['ringkasan']['bimbingan']

def grade(x):
    if x >= 80: return 'A'
    if x >= 70: return 'B'
    if x >= 60: return 'C'
    return 'E'


if __name__ == '__main__':
    sample = {
        'ketua': {'presentasi': 80, 'materi': 85, 'penulisan': 75, 'hasil': 90},
        'p1':    {'presentasi': 82, 'materi': 83, 'penulisan': 78, 'hasil': 88},
        'p2':    {'cara': 80, 'kecepatan': 80, 'ketepatan': 85},
        'bimbingan': {'ketepatan': 90, 'ketekunan': 85, 'tingkahlaku': 88},
        'seminar': 78,
    }
    ketua = calc_ketua(sample)
    p1 = calc_p1(sample)
    p2 = calc_p2(sample)
    bim = calc_bimbingan(sample)
    sidang = calc_sidang(sample)
    final = calc_final(sample)
    print({
        'nilai_ketua': round(ketua,2),
        'nilai_p1': round(p1,2),
        'nilai_p2': round(p2,2),
        'nilai_bimbingan': round(bim,2),
        'total_sidang': round(sidang,2),
        'nilai_akhir': round(final,2),
        'grade': grade(final)
    })
