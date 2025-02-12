// Mahallelere ait sentetik veriler
const mahalleler = {
    'Karakaş Mahallesi': {
        nufus_yogunlugu: 19653,   // kişi/km²
        ulasim_altyapisi: 3,       // 1: zayıf, 5: gelişmiş
        cevresel_etki: 4,          // 1-10 arasında
        sosyal_fayda: 7            // 1-10 arasında
    },
    'İstasyon Mahallesi': {
        nufus_yogunlugu: 13318,
        ulasim_altyapisi: 2,
        cevresel_etki: 6,
        sosyal_fayda: 6
    },
    'Karacaibrahim Mahallesi': {
        nufus_yogunlugu: 13316,
        ulasim_altyapisi: 4,
        cevresel_etki: 3,
        sosyal_fayda: 8
    }
};

// Ağırlıklar
const agirliklar = {
    nufus_yogunlugu: 0.4,
    ulasim_altyapisi: 0.3,
    cevresel_etki: 0.2,
    sosyal_fayda: 0.1
};

// Normalizasyon fonksiyonu
function normalize(data) {
    const maxVal = Math.max(...data);
    return data.map(x => x / maxVal);
}

// Softmax fonksiyonu
function softmax(values) {
    const eValues = values.map(x => Math.exp(x));
    const sum = eValues.reduce((acc, val) => acc + val, 0);
    return eValues.map(x => x / sum);
}

// Ağırlıklı skorları hesapla
function calculateScores(mahalleler, agirliklar) {
    const scores = {};

    // Mahalleler için kriterleri normalleştir
    const nufus_yogunlugu_values = Object.values(mahalleler).map(m => m.nufus_yogunlugu);
    const ulasim_altyapisi_values = Object.values(mahalleler).map(m => m.ulasim_altyapisi);
    const cevresel_etki_values = Object.values(mahalleler).map(m => m.cevresel_etki);
    const sosyal_fayda_values = Object.values(mahalleler).map(m => m.sosyal_fayda);
    
    const nufus_yogunlugu_norm = normalize(nufus_yogunlugu_values);
    const ulasim_altyapisi_norm = normalize(ulasim_altyapisi_values);
    const cevresel_etki_norm = normalize(cevresel_etki_values);
    const sosyal_fayda_norm = normalize(sosyal_fayda_values);

    // Her mahalle için skoru hesapla
    Object.keys(mahalleler).forEach((mahalle, index) => {
        const score = (
            agirliklar.nufus_yogunlugu * nufus_yogunlugu_norm[index] +
            agirliklar.ulasim_altyapisi * ulasim_altyapisi_norm[index] +
            agirliklar.cevresel_etki * cevresel_etki_norm[index] +
            agirliklar.sosyal_fayda * sosyal_fayda_norm[index]
        );
        scores[mahalle] = score;
    });

    return scores;
}

// Maliyet-Fayda oranını hesapla
function calculateCostBenefitRatio(maliyetler, fayda) {
    const ratios = {};
    Object.keys(mahalleler).forEach(mahalle => {
        const ratio = maliyetler[mahalle] / fayda[mahalle];
        ratios[mahalle] = ratio;
    });
    return ratios;
}

// Maliyetler ve faydalar
const maliyetler = {
    'Karakaş Mahallesi': 50000,
    'İstasyon Mahallesi': 45000,
    'Karacaibrahim Mahallesi': 60000
};

const fayda = {
    'Karakaş Mahallesi': 80,
    'İstasyon Mahallesi': 70,
    'Karacaibrahim Mahallesi': 90
};

// Skorları hesapla
const scores = calculateScores(mahalleler, agirliklar);
console.log('Mahallelere ait ağırlıklı skorlar:', scores);

// Softmax sonuçları
const softmaxScores = softmax(Object.values(scores));
console.log('Softmax sonuçları:', softmaxScores);

// Maliyet-Fayda oranını hesapla
const costBenefitRatio = calculateCostBenefitRatio(maliyetler, fayda);
console.log('Maliyet-Fayda Oranı:', costBenefitRatio);

// En uygun güzergahı belirlemek için en yüksek skoru bulma
function findBestRoute(scores) {
    let bestRoute = '';
    let highestScore = -Infinity;

    Object.keys(scores).forEach(mahalle => {
        if (scores[mahalle] > highestScore) {
            highestScore = scores[mahalle];
            bestRoute = mahalle;
        }
    });

    return bestRoute;
}

// Softmax sonuçlarıyla en yüksek skora sahip mahalleyi bulma
function findBestRouteUsingSoftmax(softmaxScores) {
    const mahallelerListesi = Object.keys(mahalleler); // Mahallelerin sırasını almak için
    const highestScoreIndex = softmaxScores.indexOf(Math.max(...softmaxScores)); // En yüksek Softmax skorunun indeksini bul
    const bestRoute = mahallelerListesi[highestScoreIndex]; // İndekse karşılık gelen mahalleyi al
    return bestRoute;
}

// En uygun güzergahı bul
const bestRoute = findBestRoute(scores);
console.log('En uygun güzergah (ağırlıklı skorlara göre):', bestRoute);

// En uygun güzergahı Softmax ile bul
const bestRouteUsingSoftmax = findBestRouteUsingSoftmax(softmaxScores);
console.log('Softmax ile en uygun güzergah:', bestRouteUsingSoftmax);