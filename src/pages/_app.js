import "@/styles/globals.css";
import Layout from '../components/Layout'
import { AuthProvider } from "./api/auth/authprovider";
import { BurgerMenuProvider } from "../components/nav/BurgerMenuProvider";
import { CategoryProvider } from "./api/context/categoriesProvider";

export default function App({ Component, pageProps }) {

  return (
    <AuthProvider>
      <CategoryProvider>
      <BurgerMenuProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BurgerMenuProvider>
      </CategoryProvider>
    </AuthProvider>
  )
  }
