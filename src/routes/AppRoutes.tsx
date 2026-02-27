import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import ProductList from '../pages/products/ProductList'
import ProductCreate from '../pages/products/ProductCreate'
import ProductDetails from '../pages/products/ProductDetails'
import ProductUpdate from '../pages/products/ProductUpdate'
import RawMaterialList from '../pages/raw-materials/RawMaterialList'
import RawMaterialCreate from '../pages/raw-materials/RawMaterialCreate'
import RawMaterialUpdate from '../pages/raw-materials/RawMaterialUpdate'
import RawMaterialDetails from '../pages/raw-materials/RawMaterialDetails'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index  element={<Home />} />
        <Route path="/produtos" element={<ProductList />} />
        <Route path="/produtos/novo" element={<ProductCreate />} />
        <Route path="/produtos/:id" element={<ProductDetails />} />
        <Route path="/produtos/:id/editar" element={<ProductUpdate />} />
        <Route path="/materias-primas" element={<RawMaterialList />} />
        <Route path="/materias-primas/novo" element={<RawMaterialCreate />} />
        <Route path="/materias-primas/:id" element={<RawMaterialDetails />} />
        <Route path="/materias-primas/:id/editar" element={<RawMaterialUpdate />} />
      </Routes>
    </BrowserRouter>
  )
}