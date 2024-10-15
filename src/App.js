import React, { useState } from 'react';
import './App.css';

function App() {
  const [fiyat, setFiyat] = useState('');
  const [kdvOrani, setKdvOrani] = useState(1);
  const [hesaplamaTipi, setHesaplamaTipi] = useState('kdvHaric');
  const [isTurizmIsletmesi, setIsTurizmIsletmesi] = useState(false);
  const [sonuc, setSonuc] = useState(null);
  const [hesaplamalar, setHesaplamalar] = useState([]);

  const hesaplaKDV = () => {
    const fiyatSayi = parseFloat(fiyat);
    if (isNaN(fiyatSayi)) {
      alert('Lütfen geçerli bir fiyat giriniz.');
      return;
    }

    let kdvHaricFiyat, kdvTutari, toplamFiyat, turizmVergisi;

    if (hesaplamaTipi === 'kdvHaric') {
      kdvHaricFiyat = fiyatSayi;
      kdvTutari = kdvHaricFiyat * (kdvOrani / 100);
      turizmVergisi = isTurizmIsletmesi ? kdvHaricFiyat * 0.02 : 0;
      toplamFiyat = kdvHaricFiyat + kdvTutari + turizmVergisi;
    } else {
      toplamFiyat = fiyatSayi;
      const vergiOrani = (kdvOrani / 100) + (isTurizmIsletmesi ? 0.02 : 0);
      kdvHaricFiyat = toplamFiyat / (1 + vergiOrani);
      kdvTutari = kdvHaricFiyat * (kdvOrani / 100);
      turizmVergisi = isTurizmIsletmesi ? kdvHaricFiyat * 0.02 : 0;
    }

    const yeniSonuc = {
      kdvHaricFiyat: kdvHaricFiyat.toFixed(2),
      kdvTutari: kdvTutari.toFixed(2),
      turizmVergisi: turizmVergisi.toFixed(2),
      toplamFiyat: toplamFiyat.toFixed(2),
      kdvOrani: kdvOrani
    };

    setSonuc(yeniSonuc);
    setHesaplamalar([...hesaplamalar, yeniSonuc]); // Yeni sonucu listenin sonuna ekle
    setFiyat('');
  };

  const toplamKDV = hesaplamalar.reduce((toplam, h) => toplam + parseFloat(h.kdvTutari), 0).toFixed(2);
  const toplamKDVHaricFiyat = hesaplamalar.reduce((toplam, h) => toplam + parseFloat(h.kdvHaricFiyat), 0).toFixed(2);
  const toplamTurizmVergisi = hesaplamalar.reduce((toplam, h) => toplam + parseFloat(h.turizmVergisi), 0).toFixed(2);
  const genelToplam = hesaplamalar.reduce((toplam, h) => toplam + parseFloat(h.toplamFiyat), 0).toFixed(2);

  return (
    <div className="muhasebe-app">
      <h1>Muhasebe Hesaplamaları</h1>
      <div className="hesaplama-formu">
        <input
          type="number"
          value={fiyat}
          onChange={(e) => setFiyat(e.target.value)}
          placeholder="Fiyatı giriniz"
        />
        <select
          value={kdvOrani}
          onChange={(e) => setKdvOrani(parseInt(e.target.value))}
        >
          <option value={1}>%1 KDV</option>
          <option value={10}>%10 KDV</option>
          <option value={20}>%20 KDV</option>
        </select>
        <select
          value={hesaplamaTipi}
          onChange={(e) => setHesaplamaTipi(e.target.value)}
        >
          <option value="kdvHaric">KDV Hariç</option>
          <option value="kdvDahil">KDV Dahil</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={isTurizmIsletmesi}
            onChange={(e) => setIsTurizmIsletmesi(e.target.checked)}
          />
          Turizm İşletmesi
        </label>
        <button onClick={hesaplaKDV}>Hesapla</button>
      </div>
      {sonuc && (
        <div className="sonuc">
          <h2>Son Hesaplama Sonucu</h2>
          <p>KDV Hariç Fiyat: {sonuc.kdvHaricFiyat} TL</p>
          <p>KDV Tutarı: {sonuc.kdvTutari} TL</p>
          <p>Turizm Vergisi: {sonuc.turizmVergisi} TL</p>
          <p>Toplam Fiyat: {sonuc.toplamFiyat} TL</p>
        </div>
      )}
      {hesaplamalar.length > 0 && (
        <div className="hesaplamalar-listesi">
          <h2>Hesaplamalar Listesi</h2>
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>KDV Oranı</th>
                  <th>KDV Hariç Fiyat</th>
                  <th>KDV Tutarı</th>
                  <th>Turizm Vergisi</th>
                  <th>Toplam Fiyat</th>
                </tr>
              </thead>
              <tbody>
                {hesaplamalar.map((h, index) => (
                  <tr key={index}>
                    <td data-label="Sıra">{index + 1}</td>
                    <td data-label="KDV Oranı">%{h.kdvOrani}</td>
                    <td data-label="KDV Hariç Fiyat">{h.kdvHaricFiyat} TL</td>
                    <td data-label="KDV Tutarı">{h.kdvTutari} TL</td>
                    <td data-label="Turizm Vergisi">{h.turizmVergisi} TL</td>
                    <td data-label="Toplam Fiyat">{h.toplamFiyat} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="toplamlar">
            <h3>Toplamlar</h3>
            <p><strong>KDV Hariç Fiyat:</strong> {toplamKDVHaricFiyat} TL</p>
            <p><strong>KDV Tutarı:</strong> {toplamKDV} TL</p>
            <p><strong>Turizm Vergisi:</strong> {toplamTurizmVergisi} TL</p>
            <p><strong>Genel Toplam:</strong> {genelToplam} TL</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
