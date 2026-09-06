import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Dapur Nasi Lemak 3D',description:'Belajar memasak nasi lemak dalam bahasa Melayu. Susun bahan di dapur 3D, masak nasi dan lauk, kemudian hias hidangan anda.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ms"><body>{children}</body></html>}
