import React from 'react'
import Hero from './sections/Hero'
import ProductList from './sections/ProductList'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <ProductList />
      <Footer/>
    </>
  )
}

export default App