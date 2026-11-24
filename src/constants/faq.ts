export const FAQ_DATA = [
  {
    question: "Apa itu SAFRONS?",
    answer: "Smart Agriculture and Fertilizer Recommendation System (SAFRONS) adalah platform sistem informasi geografis analitik spasial pertanian presisi tinggi. Versi ini, SAFRONS Jagung, berfokus pada satu komoditas: sistem menilai kesesuaian setiap satuan lahan di Bogor dan sekitarnya untuk jagung, mengurutkan lahan terbaik, dan menyajikan paket pemupukan sesuai tipe profil hara lahan."
  },
  {
    question: "Bagaimana cara membaca peta interaktif SAFRONS?",
    answer: "1. Batas wilayah administrasi dan lahan diwakili oleh poligon berwarna pada peta.\n2. Klik pada salah satu poligon untuk membuka panel informasi detail lahan di sebelah kiri layar (atau dari bawah layar pada perangkat seluler).\n3. Anda dapat menggeser peta dengan menyeret kursor atau jari Anda, serta memperbesar dan memperkecil peta menggunakan scroll mouse (pada komputer/laptop) atau gerakan mencubit layar (pada layar sentuh/trackpad)."
  },
  {
    question: "Bagaimana cara mengubah tampilan peta (basemap)?",
    answer: "1. Klik tombol Kontrol Peta (ikon roda gigi/slider pengaturan) yang berada di sudut kanan atas peta interaktif untuk membuka panel Kontrol Peta.\n2. Buka bagian Pilihan Basemap lalu pilih jenis basemap yang Anda inginkan:\n- OpenStreetMap: Menampilkan peta jalan standar, batas administratif, nama wilayah, dan objek penting.\n- Esri World Imagery: Menampilkan citra satelit bumi secara detail untuk melihat vegetasi nyata dan rupa bumi.\n- CartoDB Dark Matter: Menampilkan peta jalan dengan warna gelap yang ramah di mata."
  },
  {
    question: "Bagaimana cara mencari lokasi lahan tertentu di peta?",
    answer: "1. Klik tombol Kontrol Peta (ikon roda gigi/slider pengaturan) di sudut kanan atas peta interaktif untuk membuka panel Kontrol Peta.\n2. Pada kolom Cari Lokasi, ketik nama wilayah atau desa yang ingin Anda cari (khusus area Bogor dan sekitarnya sesuai cakupan data).\n3. Tekan Enter atau klik ikon pencarian. Peta akan otomatis memindahkan fokus dan melakukan zoom ke lokasi tersebut."
  },
  {
    question: "Apa perbedaan dan arti dari status kesesuaian lahan S1, S2, S3, dan N?",
    answer: "Tingkat kesesuaian lahan untuk jagung diklasifikasikan menurut Petunjuk Teknis Evaluasi Lahan (Ritung dkk., 2011):\n- S1 (Sangat Sesuai): Lahan optimal untuk jagung tanpa faktor pembatas yang berarti.\n- S2 (Cukup Sesuai): Lahan memiliki faktor pembatas ringan (misalnya lereng 3–8% atau hara rendah) yang memerlukan pengelolaan.\n- S3 (Sesuai Marginal): Lahan memiliki faktor pembatas berat (misalnya lereng 8–15%, drainase terhambat, atau hara sangat rendah) sehingga memerlukan pengelolaan khusus.\n- N (Tidak Sesuai): Lahan memiliki pembatas yang sangat berat, misalnya lereng di atas 15%, sehingga tidak disarankan untuk jagung.\nKelas akhir ditentukan oleh faktor terburuk (hukum minimum Liebig), bukan rata-rata."
  },
  {
    question: "Apa beda kelas aktual dan kelas potensial?",
    answer: "- Kelas aktual menggambarkan kesesuaian lahan untuk jagung dengan kondisi saat ini.\n- Kelas potensial menggambarkan kesesuaian setelah perbaikan yang wajar: pH masam dikapur dan N, P, K dipupuk sampai sesuai (naik ke S1), serta drainase yang tergenang diperbaiki satu kelas dengan saluran drainase.\n- Lereng, tekstur tanah, drainase cepat, dan pH basa dianggap permanen.\nDi panel lahan, faktor pembatas berwarna oranye dapat diperbaiki, sedangkan yang merah bersifat permanen."
  },
  {
    question: "Bagaimana peringkat lahan jagung disusun?",
    answer: "1. Buka menu Peringkat.\n2. Lahan diurutkan menurut kelas potensial, lalu kelas aktual, jumlah faktor yang perlu diperbaiki (lebih sedikit lebih baik), dan luas lahan.\n3. Gunakan filter kelas potensial (S1 saja, S1–S2, S1–S3, atau Semua), lalu klik Lihat di Peta untuk membuka lahan tersebut.\nSetiap baris adalah satu satuan peta tanah, bukan petak kebun."
  },
  {
    question: "Mengapa tidak ada lahan berkelas S1 untuk jagung?",
    answer: "Pada data Bogor saat ini, semua lahan berlereng di bawah 2% berada di lembah dan dataran aluvial yang drainasenya terhambat, di pantai berpasir yang drainasenya cepat, atau di rawa pasang surut. Perbaikan drainase hanya menaikkan satu kelas, sehingga lahan aluvial terbaik mencapai S2. Lahan lain yang lebih kering memiliki kelas lereng berupa rentang (misalnya 0–8%) yang melewati batas S1 3%, sehingga dinilai S2. Karena itu lahan terbaik untuk jagung berkelas potensial S2."
  },
  {
    question: "Apa itu tipe profil hara?",
    answer: "Tipe profil hara adalah kelompok lahan dengan pola pH, N, P, dan K yang mirip, dibentuk dengan metode k-means (contoh: N tinggi, K rendah, masam). Tipe profil dipakai untuk memilih paket pemupukan yang sesuai. Tipe profil bukan tingkat kesuburan dan tidak memengaruhi kelas kesesuaian maupun peringkat lahan."
  },
  {
    question: "Bagaimana cara melihat metrik fisik tanah dan metrik kimia hara lahan?",
    answer: "1. Klik poligon lahan yang ingin Anda periksa di peta.\n2. Pada panel detail informasi lahan, Anda akan melihat:\n- Karakteristik Fisik: Menampilkan kelas kemiringan lereng (dalam persen) dan tekstur tanah (seperti lempung, pasir, atau liat).\n- Kondisi Unsur Hara: Menampilkan nilai kadar hara Nitrogen (N), Fosfor (P), Kalium (K), serta tingkat keasaman tanah (pH)."
  },
  {
    question: "Di mana saya bisa melihat saran pemupukan dan rekomendasi dari pakar?",
    answer: "1. Klik wilayah poligon lahan yang Anda inginkan pada peta.\n2. Di panel informasi, bagian Tipe Profil Hara menampilkan Paket Pemupukan untuk pola hara lahan tersebut. Paket berlabel Draf masih menunggu validasi pakar.\n3. Di bawahnya, kartu Rekomendasi Pakar memuat saran khusus yang ditulis pakar agronomi untuk lahan tersebut."
  },
  {
    question: "Bagaimana cara menyimpan atau menandai wilayah lahan ke akun saya?",
    answer: "1. Pastikan Anda sudah masuk (login) ke akun SAFRONS Anda.\n2. Cari dan klik poligon wilayah lahan yang ingin Anda simpan pada peta.\n3. Klik tombol 'Simpan Lahan Ini' (dengan ikon bookmark) yang terletak di bagian bawah panel detail informasi lahan.\n4. Anda dapat melihat kembali semua daftar lahan yang disimpan kapan saja melalui menu Lahan Tersimpan di bilah navigasi."
  },
  {
    question: "Bagaimana cara mengajukan pendaftaran akun sebagai Pakar (Expert)?",
    answer: "1. Daftarkan akun umum terlebih dahulu melalui halaman Daftar.\n2. Kirim pesan pengajuan peningkatan peran akun ke email resmi kami di admin@safrons.id.\n3. Sertakan informasi akun Anda (nama dan email terdaftar) beserta dokumen bukti kredensial keahlian agronomi, sertifikasi pertanian, atau afiliasi instansi terkait Anda.\n4. Administrator akan meninjau berkas Anda dan mengubah peran akun Anda menjadi Pakar setelah verifikasi berhasil disetujui."
  },
  {
    question: "Apa saja fitur khusus yang didapatkan oleh pengguna dengan peran Pakar (Expert)?",
    answer: "Pengguna dengan peran Pakar yang terverifikasi dapat mengakses Dashboard Pakar untuk:\n- Mengunggah batas area lahan baru menggunakan file dengan format GeoJSON.\n- Mengubah data karakteristik fisik serta metrik unsur hara (N, P, K, pH) pada wilayah lahan terdaftar melalui formulir pengeditan.\n- Menulis, menyunting, dan menerbitkan rekomendasi pemupukan baru yang akan langsung dapat dibaca oleh para petani umum.\n- Menyunting dan memvalidasi paket pemupukan untuk setiap tipe profil hara."
  }
];
