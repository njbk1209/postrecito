import React from 'react'
import Hero from './sections/Hero'
import ProductList from './sections/ProductList'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import About from './sections/About'

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ProductList />
      <About/>
      <Footer/>
    </div>
  )
}

export default App