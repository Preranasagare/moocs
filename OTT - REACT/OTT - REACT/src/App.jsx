import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import { fetchDataFromApi } from './utils/api'

import { useSelector, useDispatch } from 'react-redux'
import { getApiConfiguration, getGenres } from './store/homeSlice'

import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './pages/home/Home'
import SearchResult from './pages/searchresult/SearchResult'
import PageNotFound from './pages/404/PageNotFound'
import Explore from './pages/explore/Explore'
import Details from './pages/details/Details'

function App() {
  const dispatch = useDispatch()
  const { url } = useSelector((state) => state.home)

  useEffect(() => {
    fetchapiConfig()
    genersCall()
  }, [])

  const fetchapiConfig = () => {
    fetchDataFromApi('/configuration').then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      }
      
      dispatch(getApiConfiguration(url))
    })
  }

  const genersCall = async () => {
    let promises = []
    let endPoints = ['tv', 'movie']
    let allGenres = {}

    endPoints.forEach((url) => {
      promises.push((fetchDataFromApi(`/genre/${url}/list`)))
    })
    // for (let i = 1; i <= endPoints.length; i++) {
    //   promises.push(fetchDataFromApi(`/genre/${endPoints[i]}/list`))
    // }
    const data = await Promise.all(promises)

    data.map(({genres})=>{
      return genres.map((item)=> allGenres[item.id] = item)
    })

    dispatch(getGenres(allGenres))
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:mediaType/:id" element={<Details />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/explore/:mediaType" element={<Explore />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
