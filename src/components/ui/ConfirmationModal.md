# ConfirmationModal Component

## Deskripsi
`ConfirmationModal` adalah komponen modal konfirmasi yang dapat digunakan kembali (reusable) untuk berbagai keperluan konfirmasi aksi seperti delete, logout, reset, dll.

## Props

| Prop | Type | Default | Required | Deskripsi |
|------|------|---------|----------|-----------|
| `isOpen` | `boolean` | - | ✅ | Menentukan apakah modal dibuka atau tidak |
| `onClose` | `() => void` | - | ✅ | Callback ketika modal ditutup |
| `onConfirm` | `() => void` | - | ✅ | Callback ketika tombol konfirmasi diklik |
| `title` | `string` | - | ✅ | Judul modal |
| `message` | `string \| ReactNode` | - | ✅ | Pesan/konten modal |
| `confirmText` | `string` | "Konfirmasi" | ❌ | Teks tombol konfirmasi |
| `cancelText` | `string` | "Batal" | ❌ | Teks tombol batal |
| `confirmButtonClass` | `string` | `"px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"` | ❌ | CSS class untuk tombol konfirmasi |
| `icon` | `string` | "heroicons:exclamation-triangle" | ❌ | Icon yang ditampilkan |
| `iconClass` | `string` | `"mx-auto h-12 w-12 text-red-500 mb-4 dark:text-red-400"` | ❌ | CSS class untuk icon |
| `isLoading` | `boolean` | `false` | ❌ | State loading |
| `loadingText` | `string` | "Memproses..." | ❌ | Teks saat loading |

## Contoh Penggunaan

### 1. Delete Confirmation (Default Red Button)
```tsx
import ConfirmationModal from "@/components/ui/ConfirmationModal";

<ConfirmationModal
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Hapus Item"
  message="Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan."
  confirmText="Hapus"
  isLoading={isDeleting}
  loadingText="Menghapus..."
/>
```

### 2. Logout Confirmation (Custom Button dengan Dark Mode Support)
```tsx
<ConfirmationModal
  isOpen={showLogoutConfirm}
  onClose={() => setShowLogoutConfirm(false)}
  onConfirm={handleLogout}
  title="Keluar"
  message="Apakah Anda yakin ingin keluar dari aplikasi?"
  confirmText="Keluar"
  confirmButtonClass="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300"
  icon="heroicons:arrow-right-on-rectangle"
  iconClass="mx-auto h-12 w-12 text-blue-500 mb-4 dark:text-blue-400"
  isLoading={isLoggingOut}
  loadingText="Keluar..."
/>
```

### 3. Success Confirmation (Custom Message dengan Dark Mode)
```tsx
<ConfirmationModal
  isOpen={showSuccessConfirm}
  onClose={() => setShowSuccessConfirm(false)}
  onConfirm={handleContinue}
  title="Berhasil!"
  message={
    <div>
      <p>Data berhasil disimpan!</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Klik lanjutkan untuk melanjutkan.
      </p>
    </div>
  }
  confirmText="Lanjutkan"
  cancelText="Tutup"
  confirmButtonClass="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300"
  icon="heroicons:check-circle"
  iconClass="mx-auto h-12 w-12 text-green-500 mb-4 dark:text-green-400"
/>
```

### 4. Warning Modal dengan Dark Mode
```tsx
<ConfirmationModal
  isOpen={showWarning}
  onClose={() => setShowWarning(false)}
  onConfirm={handleProceed}
  title="Peringatan"
  message="Tindakan ini akan mengubah data secara permanen. Pastikan Anda sudah backup data."
  confirmText="Lanjutkan"
  confirmButtonClass="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-all duration-300"
  icon="heroicons:exclamation-triangle"
  iconClass="mx-auto h-12 w-12 text-yellow-500 mb-4 dark:text-yellow-400"
  isLoading={isProcessing}
  loadingText="Memproses..."
/>
```

## Features
- ✅ **Fully Responsive design** - Sempurna di mobile dan desktop
- ✅ **Complete Dark mode support** - Semua elemen responsif terhadap dark/light theme dengan smooth transitions
- ✅ **Smooth animations** - Menggunakan framer-motion untuk entrance/exit yang halus
- ✅ **Loading state** - Built-in loading state dengan disabled buttons dan loading text
- ✅ **Highly Customizable** - Icon, styling, colors, dan text semuanya dapat dikustomisasi
- ✅ **Flexible content** - Support ReactNode untuk message yang kompleks (JSX, komponens, etc.)
- ✅ **Accessible** - Keyboard navigation, focus management, dan disabled states
- ✅ **TypeScript** - Full type safety dengan interface yang jelas

## Sudah Diimplementasikan Di:
- `CategoryTable.tsx` - Delete confirmation dan Bulk delete confirmation
- `NewsTable.tsx` - Delete confirmation

## Cara Extend:
Komponen ini mudah di-extend untuk berbagai kebutuhan:
1. Tambah props baru sesuai kebutuhan
2. Customize styling dengan props yang ada
3. Gunakan ReactNode untuk message yang kompleks
4. Ganti icon sesuai konteks (delete, warning, success, info)
