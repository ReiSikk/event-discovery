import "@/styles/globals.css";
import Layout from '../components/Layout'
import { AuthProvider } from "./api/auth/authprovider";
import { BurgerMenuProvider } from "../components/nav/BurgerMenuProvider";
import { CategoryProvider } from "./api/context/categoriesProvider";
import {APIProvider} from '@vis.gl/react-google-maps';

export default function App({ Component, pageProps }) {

  return (
  <APIProvider key={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
    <AuthProvider>
      <CategoryProvider>
      <BurgerMenuProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BurgerMenuProvider>
      </CategoryProvider>
    </AuthProvider>
  </APIProvider>
  )
  }
