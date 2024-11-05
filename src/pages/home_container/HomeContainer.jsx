import React from 'react'
import Hero from './hero/Hero'
import Search from '../search/Search'
import Category from './category/Category'
import Offer from './offer/Offer'
import Navbar from '../../components/navbar/Navbar'
export default function HomeContainer() {
  return (
  <>
  <Navbar/>
  <Hero/>
  <Search/>
  <Category/>
  <Offer/>
  </>
  )
}
