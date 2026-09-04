// Konstanta π
const PI = Math.PI;

// Fungsi untuk memformat angka dengan 2 desimal
function formatAngka(num) {
    return num.toFixed(2);
}

function pastikanPositif(nilai, pesan) {
    if (!Number.isFinite(nilai) || nilai <= 0) {
        throw new Error(pesan);
    }
}

// Fungsi untuk membersihkan input field berdasarkan jenis perhitungan
function bersihkanInput(bangun) {
    const inputs = document.querySelectorAll(`#${bangun}-form input`);
    inputs.forEach(input => input.value = '');
}

// Fungsi untuk menampilkan/menyembunyikan input field berdasarkan pilihan
function updateInputFields(bangun, jenis) {
    const container = document.getElementById(`${bangun}-form`);
    const inputs = container.querySelectorAll('.input-field');
    
    // Sembunyikan semua input terlebih dahulu
    inputs.forEach(input => input.style.display = 'none');
    
    // Tampilkan input yang diperlukan berdasarkan jenis perhitungan
    const showInputs = (ids) => {
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.parentElement.style.display = 'flex';
            }
        });
    };

    switch (bangun) {
        case 'tabung':
            switch (jenis) {
                case 'volume_luas':
                    showInputs(['tabung-jari', 'tabung-tinggi']);
                    break;
                case 'jari_volume':
                    showInputs(['tabung-volume', 'tabung-tinggi']);
                    break;
                case 'tinggi_volume':
                    showInputs(['tabung-volume', 'tabung-jari']);
                    break;
                case 'jari_luas_selimut':
                    showInputs(['tabung-luas-selimut', 'tabung-tinggi']);
                    break;
                case 'tinggi_luas_selimut':
                    showInputs(['tabung-luas-selimut', 'tabung-jari']);
                    break;
                case 'jari_luas_permukaan':
                    showInputs(['tabung-luas-permukaan', 'tabung-tinggi']);
                    break;
                case 'tinggi_luas_permukaan':
                    showInputs(['tabung-luas-permukaan', 'tabung-jari']);
                    break;
            }
            break;
            
        case 'kerucut':
            switch (jenis) {
                case 'volume_luas':
                    showInputs(['kerucut-jari', 'kerucut-tinggi']);
                    break;
                case 'jari_volume':
                    showInputs(['kerucut-volume', 'kerucut-tinggi']);
                    break;
                case 'tinggi_volume':
                    showInputs(['kerucut-volume', 'kerucut-jari']);
                    break;
                case 'jari_luas_selimut':
                    showInputs(['kerucut-luas-selimut', 'kerucut-tinggi']);
                    break;
                case 'tinggi_luas_selimut':
                    showInputs(['kerucut-luas-selimut', 'kerucut-jari']);
                    break;
                case 'jari_luas_permukaan':
                    showInputs(['kerucut-luas-permukaan', 'kerucut-tinggi']);
                    break;
                case 'tinggi_luas_permukaan':
                    showInputs(['kerucut-luas-permukaan', 'kerucut-jari']);
                    break;
            }
            break;
            
        case 'bola':
            switch (jenis) {
                case 'volume_luas':
                    showInputs(['bola-jari']);
                    break;
                case 'jari_volume':
                    showInputs(['bola-volume']);
                    break;
                case 'jari_luas_permukaan':
                    showInputs(['bola-luas-permukaan']);
                    break;
            }
            break;
    }
}

// Mengganti ilustrasi dan daftar unsur saat pengguna memilih tab.
function updateVisualizer(bangun) {
    const names = {
        tabung: 'Tabung',
        kerucut: 'Kerucut',
        bola: 'Bola'
    };
    const descriptions = {
        tabung: 'Bangun dengan dua alas berbentuk lingkaran yang sejajar dan sebuah selimut.',
        kerucut: 'Bangun dengan satu alas lingkaran dan satu titik puncak yang dihubungkan selimut.',
        bola: 'Bangun yang seluruh permukaannya melengkung dan setiap titiknya berjarak sama dari pusat.'
    };

    document.getElementById('visualizer-name').textContent = names[bangun];
    document.getElementById('visualizer-description').textContent = descriptions[bangun];
    document.querySelector('.diagram-wrap').setAttribute('aria-label', `Ilustrasi unsur-unsur ${names[bangun].toLowerCase()}`);
    document.querySelectorAll('.diagram').forEach(diagram => {
        const isActive = diagram.id === `diagram-${bangun}`;
        diagram.classList.toggle('active', isActive);
        diagram.setAttribute('aria-hidden', String(!isActive));
    });
    document.querySelectorAll('.element-list').forEach(list => {
        list.classList.toggle('active', list.id === `elements-${bangun}`);
    });
}

// Event Listeners untuk tab bangun ruang
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Hapus class active dari semua tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        // Sembunyikan semua form
        document.querySelectorAll('.bangun-form').forEach(form => form.classList.remove('active'));
        
        // Tambah class active ke tab yang diklik
        this.classList.add('active');
        // Tampilkan form yang sesuai
        const bangun = this.getAttribute('data-bangun');
        document.getElementById(`${bangun}-form`).classList.add('active');
        updateVisualizer(bangun);
        
        // Reset hasil
        document.getElementById('hasil-nilai').innerHTML = '';
        document.getElementById('langkah-penyelesaian').innerHTML = '';
        
        // Update input fields untuk form yang aktif
        const select = document.getElementById(`${bangun}-jenis`);
        updateInputFields(bangun, select.value);
    });
});

// Event Listeners untuk perubahan jenis perhitungan
document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', function() {
        const bangun = this.id.replace('-jenis', '');
        const jenis = this.value;
        bersihkanInput(bangun);
        updateInputFields(bangun, jenis);
    });
});

// Inisialisasi awal
document.addEventListener('DOMContentLoaded', function() {
    // Set input fields untuk semua bangun ruang
    updateInputFields('tabung', 'volume_luas');
    updateInputFields('kerucut', 'volume_luas');
    updateInputFields('bola', 'volume_luas');
    updateVisualizer('tabung');
});

// ===== FUNGSI PERHITUNGAN TABUNG =====
function hitungTabung() {
    const jenis = document.getElementById('tabung-jenis').value;
    const jari = parseFloat(document.getElementById('tabung-jari').value) || 0;
    const tinggi = parseFloat(document.getElementById('tabung-tinggi').value) || 0;
    const volume = parseFloat(document.getElementById('tabung-volume').value) || 0;
    const luasSelimut = parseFloat(document.getElementById('tabung-luas-selimut').value) || 0;
    const luasPermukaan = parseFloat(document.getElementById('tabung-luas-permukaan').value) || 0;
    
    let hasilHTML = '';
    let langkahHTML = '<h4>Langkah-langkah Penyelesaian</h4>';
    
    try {
        switch (jenis) {
            case 'volume_luas':
                // 1. Hitung volume dan luas tabung
                if (jari <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai jari-jari dan tinggi yang valid!');
                }
                
                const volumeTabung = PI * jari * jari * tinggi;
                const luasSelimutTabung = 2 * PI * jari * tinggi;
                const luasPermukaanTabung = 2 * PI * jari * (jari + tinggi);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Volume:</span>
                        <span class="hasil-value">${formatAngka(volumeTabung)} cm³</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Selimut:</span>
                        <span class="hasil-value">${formatAngka(luasSelimutTabung)} cm²</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Permukaan:</span>
                        <span class="hasil-value">${formatAngka(luasPermukaanTabung)} cm²</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Menghitung Volume:</div>
                        <div class="rumus">V = π × r² × t</div>
                        <div class="rumus">V = ${PI.toFixed(2)} × ${jari}² × ${tinggi}</div>
                        <div class="rumus">V = ${PI.toFixed(2)} × ${(jari*jari).toFixed(2)} × ${tinggi}</div>
                        <div class="rumus">V = ${formatAngka(volumeTabung)} cm³</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menghitung Luas Selimut:</div>
                        <div class="rumus">Ls = 2 × π × r × t</div>
                        <div class="rumus">Ls = 2 × ${PI.toFixed(2)} × ${jari} × ${tinggi}</div>
                        <div class="rumus">Ls = ${formatAngka(luasSelimutTabung)} cm²</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Menghitung Luas Permukaan:</div>
                        <div class="rumus">Lp = 2 × π × r × (r + t)</div>
                        <div class="rumus">Lp = 2 × ${PI.toFixed(2)} × ${jari} × (${jari} + ${tinggi})</div>
                        <div class="rumus">Lp = 2 × ${PI.toFixed(2)} × ${jari} × ${(jari + tinggi)}</div>
                        <div class="rumus">Lp = ${formatAngka(luasPermukaanTabung)} cm²</div>
                    </div>
                `;
                break;
                
            case 'jari_volume':
                // 2. Cari jari-jari dari volume tabung
                if (volume <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai volume dan tinggi yang valid!');
                }
                
                const jariDariVolume = Math.sqrt(volume / (PI * tinggi));
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Tabung:</span>
                        <span class="hasil-value">${formatAngka(jariDariVolume)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Volume Tabung:</div>
                        <div class="rumus">V = π × r² × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari r²:</div>
                        <div class="rumus">r² = V ÷ (π × t)</div>
                        <div class="rumus">r² = ${volume} ÷ (${PI.toFixed(2)} × ${tinggi})</div>
                        <div class="rumus">r² = ${volume} ÷ ${(PI * tinggi).toFixed(2)}</div>
                        <div class="rumus">r² = ${(volume / (PI * tinggi)).toFixed(2)}</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari r:</div>
                        <div class="rumus">r = √(r²)</div>
                        <div class="rumus">r = √${(volume / (PI * tinggi)).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariVolume)} cm</div>
                    </div>
                `;
                break;
                
            case 'tinggi_volume':
                // 3. Cari tinggi dari volume tabung
                if (volume <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai volume dan jari-jari yang valid!');
                }
                
                const tinggiDariVolume = volume / (PI * jari * jari);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Tabung:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariVolume)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Volume Tabung:</div>
                        <div class="rumus">V = π × r² × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari t:</div>
                        <div class="rumus">t = V ÷ (π × r²)</div>
                        <div class="rumus">t = ${volume} ÷ (${PI.toFixed(2)} × ${jari}²)</div>
                        <div class="rumus">t = ${volume} ÷ (${PI.toFixed(2)} × ${(jari*jari).toFixed(2)})</div>
                        <div class="rumus">t = ${volume} ÷ ${(PI * jari * jari).toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariVolume)} cm</div>
                    </div>
                `;
                break;
                
            case 'jari_luas_selimut':
                // 4. Cari jari-jari dari luas selimut tabung
                if (luasSelimut <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai luas selimut dan tinggi yang valid!');
                }
                
                const jariDariLuasSelimut = luasSelimut / (2 * PI * tinggi);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Tabung:</span>
                        <span class="hasil-value">${formatAngka(jariDariLuasSelimut)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Selimut Tabung:</div>
                        <div class="rumus">Ls = 2 × π × r × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari r:</div>
                        <div class="rumus">r = Ls ÷ (2 × π × t)</div>
                        <div class="rumus">r = ${luasSelimut} ÷ (2 × ${PI.toFixed(2)} × ${tinggi})</div>
                        <div class="rumus">r = ${luasSelimut} ÷ ${(2 * PI * tinggi).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariLuasSelimut)} cm</div>
                    </div>
                `;
                break;
                
            case 'tinggi_luas_selimut':
                // 5. Cari tinggi dari luas selimut tabung
                if (luasSelimut <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai luas selimut dan jari-jari yang valid!');
                }
                
                const tinggiDariLuasSelimut = luasSelimut / (2 * PI * jari);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Tabung:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariLuasSelimut)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Selimut Tabung:</div>
                        <div class="rumus">Ls = 2 × π × r × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari t:</div>
                        <div class="rumus">t = Ls ÷ (2 × π × r)</div>
                        <div class="rumus">t = ${luasSelimut} ÷ (2 × ${PI.toFixed(2)} × ${jari})</div>
                        <div class="rumus">t = ${luasSelimut} ÷ ${(2 * PI * jari).toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariLuasSelimut)} cm</div>
                    </div>
                `;
                break;
                
            case 'jari_luas_permukaan':
                // 6. Cari jari-jari dari luas permukaan tabung
                if (luasPermukaan <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai luas permukaan dan tinggi yang valid!');
                }
                
                // Lp = 2πr² + 2πrt => 2πr² + 2πt·r - Lp = 0
                const a = 2 * PI;
                const b = 2 * PI * tinggi;
                const c = -luasPermukaan;
                const discriminant = b*b - 4*a*c;
                
                if (discriminant < 0) {
                    throw new Error('Tidak ada solusi real untuk nilai yang diberikan!');
                }
                
                const jariDariLuasPermukaan = (-b + Math.sqrt(discriminant)) / (2*a);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Tabung:</span>
                        <span class="hasil-value">${formatAngka(jariDariLuasPermukaan)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Permukaan Tabung:</div>
                        <div class="rumus">Lp = 2πr² + 2πrt</div>
                        <div class="rumus">${luasPermukaan} = 2 × ${PI.toFixed(2)} × r² + 2 × ${PI.toFixed(2)} × ${tinggi} × r</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menyusun Persamaan Kuadrat:</div>
                        <div class="rumus">2πr² + 2πt·r - Lp = 0</div>
                        <div class="rumus">${(2*PI).toFixed(2)}r² + ${(2*PI*tinggi).toFixed(2)}r - ${luasPermukaan} = 0</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Menggunakan Rumus ABC:</div>
                        <div class="rumus">r = [-b ± √(b² - 4ac)] / 2a</div>
                        <div class="rumus">r = [${(-b).toFixed(2)} ± √(${b.toFixed(2)}² - 4×${a.toFixed(2)}×${c.toFixed(2)})] / (2×${a.toFixed(2)})</div>
                        <div class="rumus">r = [${(-b).toFixed(2)} ± √(${discriminant.toFixed(2)})] / ${(2*a).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariLuasPermukaan)} cm (hanya mengambil nilai positif)</div>
                    </div>
                `;
                break;
                
            case 'tinggi_luas_permukaan':
                // 7. Cari tinggi dari luas permukaan tabung
                if (luasPermukaan <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai luas permukaan dan jari-jari yang valid!');
                }
                
                const tinggiDariLuasPermukaan = (luasPermukaan - 2 * PI * jari * jari) / (2 * PI * jari);
                pastikanPositif(tinggiDariLuasPermukaan, 'Luas permukaan terlalu kecil untuk jari-jari tersebut. Tinggi harus lebih besar dari nol.');
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Tabung:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariLuasPermukaan)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Permukaan Tabung:</div>
                        <div class="rumus">Lp = 2πr² + 2πrt</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari t:</div>
                        <div class="rumus">2πrt = Lp - 2πr²</div>
                        <div class="rumus">t = (Lp - 2πr²) ÷ (2πr)</div>
                        <div class="rumus">t = (${luasPermukaan} - 2 × ${PI.toFixed(2)} × ${jari}²) ÷ (2 × ${PI.toFixed(2)} × ${jari})</div>
                        <div class="rumus">t = (${luasPermukaan} - ${(2 * PI * jari * jari).toFixed(2)}) ÷ ${(2 * PI * jari).toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariLuasPermukaan)} cm</div>
                    </div>
                `;
                break;
        }
        
        document.getElementById('hasil-nilai').innerHTML = hasilHTML;
        document.getElementById('langkah-penyelesaian').innerHTML = langkahHTML;
        
    } catch (error) {
        alert(error.message);
    }
}

// ===== FUNGSI PERHITUNGAN KERUCUT =====
function hitungKerucut() {
    const jenis = document.getElementById('kerucut-jenis').value;
    const jari = parseFloat(document.getElementById('kerucut-jari').value) || 0;
    const tinggi = parseFloat(document.getElementById('kerucut-tinggi').value) || 0;
    const volume = parseFloat(document.getElementById('kerucut-volume').value) || 0;
    const luasSelimut = parseFloat(document.getElementById('kerucut-luas-selimut').value) || 0;
    const luasPermukaan = parseFloat(document.getElementById('kerucut-luas-permukaan').value) || 0;
    
    let hasilHTML = '';
    let langkahHTML = '<h4>Langkah-langkah Penyelesaian</h4>';
    
    try {
        switch (jenis) {
            case 'volume_luas':
                // 8. Hitung volume dan luas kerucut
                if (jari <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai jari-jari dan tinggi yang valid!');
                }
                
                const garisPelukis = Math.sqrt(jari * jari + tinggi * tinggi);
                const volumeKerucut = (1/3) * PI * jari * jari * tinggi;
                const luasSelimutKerucut = PI * jari * garisPelukis;
                const luasPermukaanKerucut = PI * jari * (jari + garisPelukis);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Volume:</span>
                        <span class="hasil-value">${formatAngka(volumeKerucut)} cm³</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Selimut:</span>
                        <span class="hasil-value">${formatAngka(luasSelimutKerucut)} cm²</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Permukaan:</span>
                        <span class="hasil-value">${formatAngka(luasPermukaanKerucut)} cm²</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Garis Pelukis:</span>
                        <span class="hasil-value">${formatAngka(garisPelukis)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Menghitung Garis Pelukis:</div>
                        <div class="rumus">s = √(r² + t²)</div>
                        <div class="rumus">s = √(${jari}² + ${tinggi}²)</div>
                        <div class="rumus">s = √(${(jari*jari).toFixed(2)} + ${(tinggi*tinggi).toFixed(2)})</div>
                        <div class="rumus">s = √${(jari*jari + tinggi*tinggi).toFixed(2)}</div>
                        <div class="rumus">s = ${formatAngka(garisPelukis)} cm</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menghitung Volume:</div>
                        <div class="rumus">V = ⅓ × π × r² × t</div>
                        <div class="rumus">V = ⅓ × ${PI.toFixed(2)} × ${jari}² × ${tinggi}</div>
                        <div class="rumus">V = ⅓ × ${PI.toFixed(2)} × ${(jari*jari).toFixed(2)} × ${tinggi}</div>
                        <div class="rumus">V = ${formatAngka(volumeKerucut)} cm³</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Menghitung Luas Selimut:</div>
                        <div class="rumus">Ls = π × r × s</div>
                        <div class="rumus">Ls = ${PI.toFixed(2)} × ${jari} × ${formatAngka(garisPelukis)}</div>
                        <div class="rumus">Ls = ${formatAngka(luasSelimutKerucut)} cm²</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">4. Menghitung Luas Permukaan:</div>
                        <div class="rumus">Lp = π × r × (r + s)</div>
                        <div class="rumus">Lp = ${PI.toFixed(2)} × ${jari} × (${jari} + ${formatAngka(garisPelukis)})</div>
                        <div class="rumus">Lp = ${PI.toFixed(2)} × ${jari} × ${(jari + garisPelukis).toFixed(2)}</div>
                        <div class="rumus">Lp = ${formatAngka(luasPermukaanKerucut)} cm²</div>
                    </div>
                `;
                break;
                
            case 'jari_volume':
                // 9. Cari jari-jari dari volume kerucut
                if (volume <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai volume dan tinggi yang valid!');
                }
                
                const jariDariVolume = Math.sqrt((3 * volume) / (PI * tinggi));
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Kerucut:</span>
                        <span class="hasil-value">${formatAngka(jariDariVolume)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Volume Kerucut:</div>
                        <div class="rumus">V = ⅓ × π × r² × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari r²:</div>
                        <div class="rumus">r² = (3 × V) ÷ (π × t)</div>
                        <div class="rumus">r² = (3 × ${volume}) ÷ (${PI.toFixed(2)} × ${tinggi})</div>
                        <div class="rumus">r² = ${3 * volume} ÷ ${(PI * tinggi).toFixed(2)}</div>
                        <div class="rumus">r² = ${((3 * volume) / (PI * tinggi)).toFixed(2)}</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari r:</div>
                        <div class="rumus">r = √(r²)</div>
                        <div class="rumus">r = √${((3 * volume) / (PI * tinggi)).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariVolume)} cm</div>
                    </div>
                `;
                break;
                
            case 'tinggi_volume':
                // 10. Cari tinggi dari volume kerucut
                if (volume <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai volume dan jari-jari yang valid!');
                }
                
                const tinggiDariVolume = (3 * volume) / (PI * jari * jari);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Kerucut:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariVolume)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Volume Kerucut:</div>
                        <div class="rumus">V = ⅓ × π × r² × t</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari t:</div>
                        <div class="rumus">t = (3 × V) ÷ (π × r²)</div>
                        <div class="rumus">t = (3 × ${volume}) ÷ (${PI.toFixed(2)} × ${jari}²)</div>
                        <div class="rumus">t = ${3 * volume} ÷ (${PI.toFixed(2)} × ${(jari*jari).toFixed(2)})</div>
                        <div class="rumus">t = ${3 * volume} ÷ ${(PI * jari * jari).toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariVolume)} cm</div>
                    </div>
                `;
                break;
                
            case 'jari_luas_selimut':
                // 11. Cari jari-jari dari luas selimut kerucut
                if (luasSelimut <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai luas selimut dan tinggi yang valid!');
                }
                
                // Ls = π × r × s, dimana s = √(r² + t²)
                // Ls = π × r × √(r² + t²)
                // Ls = πr√(r² + t²). Substitusi x = r² menghasilkan persamaan kuadrat.
                const luasSelimutPerPI = luasSelimut / PI;
                const rKuadrat = (-tinggi * tinggi + Math.sqrt(
                    tinggi ** 4 + 4 * luasSelimutPerPI ** 2
                )) / 2;
                pastikanPositif(rKuadrat, 'Tidak ada solusi positif untuk luas selimut dan tinggi tersebut.');
                const rEstimate = Math.sqrt(rKuadrat);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Kerucut:</span>
                        <span class="hasil-value">${formatAngka(rEstimate)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Selimut Kerucut:</div>
                        <div class="rumus">Ls = π × r × √(r² + t²)</div>
                        <div class="rumus">${luasSelimut} = ${PI.toFixed(2)} × r × √(r² + ${tinggi}²)</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menyelesaikan persamaan:</div>
                        <div class="rumus">r² = [-t² + √(t⁴ + 4(Ls/π)²)] ÷ 2</div>
                        <div class="rumus">r = ${formatAngka(rEstimate)} cm</div>
                    </div>
                `;
                break;
                
            case 'tinggi_luas_selimut':
                // 12. Cari tinggi dari luas selimut kerucut
                if (luasSelimut <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai luas selimut dan jari-jari yang valid!');
                }
                
                const sDariLuasSelimut = luasSelimut / (PI * jari);
                const tinggiKuadratSelimut = sDariLuasSelimut*sDariLuasSelimut - jari*jari;
                pastikanPositif(tinggiKuadratSelimut, 'Luas selimut tidak valid: garis pelukis harus lebih besar dari jari-jari.');
                const tinggiDariLuasSelimut = Math.sqrt(tinggiKuadratSelimut);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Kerucut:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariLuasSelimut)} cm</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Garis Pelukis:</span>
                        <span class="hasil-value">${formatAngka(sDariLuasSelimut)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Selimut Kerucut:</div>
                        <div class="rumus">Ls = π × r × s</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari s (garis pelukis):</div>
                        <div class="rumus">s = Ls ÷ (π × r)</div>
                        <div class="rumus">s = ${luasSelimut} ÷ (${PI.toFixed(2)} × ${jari})</div>
                        <div class="rumus">s = ${formatAngka(sDariLuasSelimut)} cm</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari t (tinggi):</div>
                        <div class="rumus">t = √(s² - r²)</div>
                        <div class="rumus">t = √(${formatAngka(sDariLuasSelimut)}² - ${jari}²)</div>
                        <div class="rumus">t = √(${(sDariLuasSelimut*sDariLuasSelimut).toFixed(2)} - ${(jari*jari).toFixed(2)})</div>
                        <div class="rumus">t = √${(sDariLuasSelimut*sDariLuasSelimut - jari*jari).toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariLuasSelimut)} cm</div>
                    </div>
                `;
                break;
                
            case 'jari_luas_permukaan':
                // 13. Cari jari-jari dari luas permukaan kerucut
                if (luasPermukaan <= 0 || tinggi <= 0) {
                    throw new Error('Masukkan nilai luas permukaan dan tinggi yang valid!');
                }
                
                // Lp = πr² + πrs, dimana s = √(r² + t²)
                // Lp = πr² + πr√(r² + t²)
                // Lp = πr(r + √(r² + t²)); bentuk ini dapat diselesaikan langsung.
                const luasPermukaanPerPI = luasPermukaan / PI;
                const rEstimateLP = luasPermukaanPerPI / Math.sqrt(
                    tinggi * tinggi + 2 * luasPermukaanPerPI
                );
                pastikanPositif(rEstimateLP, 'Tidak ada solusi positif untuk luas permukaan dan tinggi tersebut.');
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Kerucut:</span>
                        <span class="hasil-value">${formatAngka(rEstimateLP)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Permukaan Kerucut:</div>
                        <div class="rumus">Lp = πr² + πr√(r² + t²)</div>
                        <div class="rumus">${luasPermukaan} = ${PI.toFixed(2)} × r² + ${PI.toFixed(2)} × r × √(r² + ${tinggi}²)</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menyelesaikan persamaan:</div>
                        <div class="rumus">r = (Lp/π) ÷ √(t² + 2Lp/π)</div>
                        <div class="rumus">r = ${formatAngka(rEstimateLP)} cm</div>
                    </div>
                `;
                break;
                
            case 'tinggi_luas_permukaan':
                // 14. Cari tinggi dari luas permukaan kerucut
                if (luasPermukaan <= 0 || jari <= 0) {
                    throw new Error('Masukkan nilai luas permukaan dan jari-jari yang valid!');
                }
                
                // Lp = πr² + πr√(r² + t²)
                // πr√(r² + t²) = Lp - πr²
                // Kuadratkan kedua sisi: π²r²(r² + t²) = (Lp - πr²)²
                const A = (PI * jari) * (PI * jari);
                const B = A * jari * jari;
                const C = (luasPermukaan - PI * jari * jari) * (luasPermukaan - PI * jari * jari);
                const tSquared = (C - B) / A;
                pastikanPositif(luasPermukaan - PI * jari * jari, 'Luas permukaan harus lebih besar dari luas alas kerucut.');
                pastikanPositif(tSquared, 'Tidak ada tinggi positif untuk luas permukaan dan jari-jari tersebut.');
                const tinggiDariLuasPermukaan = Math.sqrt(tSquared);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Tinggi Kerucut:</span>
                        <span class="hasil-value">${formatAngka(tinggiDariLuasPermukaan)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Permukaan Kerucut:</div>
                        <div class="rumus">Lp = πr² + πr√(r² + t²)</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menyusun persamaan:</div>
                        <div class="rumus">πr√(r² + t²) = Lp - πr²</div>
                        <div class="rumus">${PI.toFixed(2)} × ${jari} × √(${jari}² + t²) = ${luasPermukaan} - ${PI.toFixed(2)} × ${jari}²</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari t²:</div>
                        <div class="rumus">t² = [(Lp - πr²)² - π²r⁴] ÷ (π²r²)</div>
                        <div class="rumus">t² = [(${luasPermukaan} - ${(PI * jari * jari).toFixed(2)})² - ${(PI*PI*jari*jari*jari*jari).toFixed(2)}] ÷ ${(PI*PI*jari*jari).toFixed(2)}</div>
                        <div class="rumus">t² = ${tSquared.toFixed(2)}</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">4. Mencari t:</div>
                        <div class="rumus">t = √(t²)</div>
                        <div class="rumus">t = √${tSquared.toFixed(2)}</div>
                        <div class="rumus">t = ${formatAngka(tinggiDariLuasPermukaan)} cm</div>
                    </div>
                `;
                break;
        }
        
        document.getElementById('hasil-nilai').innerHTML = hasilHTML;
        document.getElementById('langkah-penyelesaian').innerHTML = langkahHTML;
        
    } catch (error) {
        alert(error.message);
    }
}

// ===== FUNGSI PERHITUNGAN BOLA =====
function hitungBola() {
    const jenis = document.getElementById('bola-jenis').value;
    const jari = parseFloat(document.getElementById('bola-jari').value) || 0;
    const volume = parseFloat(document.getElementById('bola-volume').value) || 0;
    const luasPermukaan = parseFloat(document.getElementById('bola-luas-permukaan').value) || 0;
    
    let hasilHTML = '';
    let langkahHTML = '<h4>Langkah-langkah Penyelesaian</h4>';
    
    try {
        switch (jenis) {
            case 'volume_luas':
                // 15. Hitung volume dan luas bola
                if (jari <= 0) {
                    throw new Error('Masukkan nilai jari-jari yang valid!');
                }
                
                const volumeBola = (4/3) * PI * jari * jari * jari;
                const luasPermukaanBola = 4 * PI * jari * jari;
                const luasSelimutBola = luasPermukaanBola;
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Volume:</span>
                        <span class="hasil-value">${formatAngka(volumeBola)} cm³</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Permukaan:</span>
                        <span class="hasil-value">${formatAngka(luasPermukaanBola)} cm²</span>
                    </div>
                    <div class="hasil-item">
                        <span class="hasil-label">Luas Selimut:</span>
                        <span class="hasil-value">${formatAngka(luasSelimutBola)} cm²</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Menghitung Volume:</div>
                        <div class="rumus">V = 4/3 × π × r³</div>
                        <div class="rumus">V = 4/3 × ${PI.toFixed(2)} × ${jari}³</div>
                        <div class="rumus">V = 4/3 × ${PI.toFixed(2)} × ${(jari*jari*jari).toFixed(2)}</div>
                        <div class="rumus">V = ${formatAngka(volumeBola)} cm³</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Menghitung Luas Permukaan:</div>
                        <div class="rumus">Lp = 4 × π × r²</div>
                        <div class="rumus">Lp = 4 × ${PI.toFixed(2)} × ${jari}²</div>
                        <div class="rumus">Lp = 4 × ${PI.toFixed(2)} × ${(jari*jari).toFixed(2)}</div>
                        <div class="rumus">Lp = ${formatAngka(luasPermukaanBola)} cm²</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">Catatan:</div>
                        <div>Pada bola, luas selimut sama dengan luas permukaan karena tidak memiliki alas dan tutup</div>
                    </div>
                `;
                break;
                
            case 'jari_volume':
                // 16. Cari jari-jari dari volume bola
                if (volume <= 0) {
                    throw new Error('Masukkan nilai volume yang valid!');
                }
                
                const jariDariVolume = Math.pow((3 * volume) / (4 * PI), 1/3);
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Bola:</span>
                        <span class="hasil-value">${formatAngka(jariDariVolume)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Volume Bola:</div>
                        <div class="rumus">V = 4/3 × π × r³</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari r³:</div>
                        <div class="rumus">r³ = (3 × V) ÷ (4 × π)</div>
                        <div class="rumus">r³ = (3 × ${volume}) ÷ (4 × ${PI.toFixed(2)})</div>
                        <div class="rumus">r³ = ${3 * volume} ÷ ${(4 * PI).toFixed(2)}</div>
                        <div class="rumus">r³ = ${((3 * volume) / (4 * PI)).toFixed(2)}</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari r:</div>
                        <div class="rumus">r = ³√(r³)</div>
                        <div class="rumus">r = ³√${((3 * volume) / (4 * PI)).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariVolume)} cm</div>
                    </div>
                `;
                break;
                
            case 'jari_luas_permukaan':
                // 17. Cari jari-jari dari luas permukaan bola
                if (luasPermukaan <= 0) {
                    throw new Error('Masukkan nilai luas permukaan yang valid!');
                }
                
                const jariDariLuasPermukaan = Math.sqrt(luasPermukaan / (4 * PI));
                
                hasilHTML = `
                    <div class="hasil-item">
                        <span class="hasil-label">Jari-jari Bola:</span>
                        <span class="hasil-value">${formatAngka(jariDariLuasPermukaan)} cm</span>
                    </div>
                `;
                
                langkahHTML += `
                    <div class="langkah">
                        <div class="langkah-nomor">1. Rumus Luas Permukaan Bola:</div>
                        <div class="rumus">Lp = 4 × π × r²</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">2. Mencari r²:</div>
                        <div class="rumus">r² = Lp ÷ (4 × π)</div>
                        <div class="rumus">r² = ${luasPermukaan} ÷ (4 × ${PI.toFixed(2)})</div>
                        <div class="rumus">r² = ${luasPermukaan} ÷ ${(4 * PI).toFixed(2)}</div>
                        <div class="rumus">r² = ${(luasPermukaan / (4 * PI)).toFixed(2)}</div>
                    </div>
                    <div class="langkah">
                        <div class="langkah-nomor">3. Mencari r:</div>
                        <div class="rumus">r = √(r²)</div>
                        <div class="rumus">r = √${(luasPermukaan / (4 * PI)).toFixed(2)}</div>
                        <div class="rumus">r = ${formatAngka(jariDariLuasPermukaan)} cm</div>
                    </div>
                `;
                break;
        }
        
        document.getElementById('hasil-nilai').innerHTML = hasilHTML;
        document.getElementById('langkah-penyelesaian').innerHTML = langkahHTML;
        
    } catch (error) {
        alert(error.message);
    }
}
// Tambahkan di akhir file script.js, sebelum penutup
document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tombol share
    initShareButtons();
});

function initShareButtons() {
    const shareUrl = window.location.href;
    const shareTitle = 'Kalkulator Bangun Ruang Sisi Lengkung';
    const shareText = 'Hitung volume, luas permukaan, dan luas selimut tabung, kerucut, dan bola dengan langkah penyelesaian lengkap! ✅\n\nCoba sekarang:';
    
    // WhatsApp
    document.querySelector('.share-btn.whatsapp').addEventListener('click', function() {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
        window.open(url, '_blank');
    });
    
    // Facebook
    document.querySelector('.share-btn.facebook').addEventListener('click', function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=600,height=400');
    });
    
    // Twitter
    document.querySelector('.share-btn.twitter').addEventListener('click', function() {
        const url = `https://x.com/intent/post?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(url, '_blank', 'width=600,height=400');
    });
    
    // Instagram
    document.querySelector('.share-btn.instagram').addEventListener('click', function() {
        // Instagram tidak mendukung sharing langsung, jadi kita copy link
        copyToClipboard(shareUrl);
        showCopyNotification('Link disalin. Tempelkan di Instagram Direct atau Story.');
    });
    
    // Telegram
    document.querySelector('.share-btn.telegram').addEventListener('click', function() {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(url, '_blank');
    });
    
    // Copy Link
    document.querySelector('.share-btn.copy-link').addEventListener('click', function() {
        copyToClipboard(shareUrl);
        showCopyNotification();
    });
}

function copyToClipboard(text) {
    // Metode modern menggunakan Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Gagal menyalin: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback untuk browser lama
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (!successful) {
            throw new Error('Gagal menyalin');
        }
    } catch (err) {
        console.error('Gagal menyalin: ', err);
        prompt('Salin link berikut:', text);
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message = 'Link berhasil disalin!') {
    const notification = document.getElementById('copy-notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
