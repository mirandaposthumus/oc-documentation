import React from 'react'
import Layout from '../components/Layout/Layout'
import Main from '../components/Layout/Main'
import { Helmet } from 'react-helmet'

export default () => (
  <Layout>
    <Helmet title={`Four51 OrderCloud`} />
    <Main />
  </Layout>
)
