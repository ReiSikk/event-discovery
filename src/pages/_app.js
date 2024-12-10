import "@/styles/globals.css";
import Layout from '../components/Layout'
import { AuthProvider } from "./api/auth/authprovider";
import { BurgerMenuProvider } from "../components/nav/BurgerMenuProvider";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BurgerMenuProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </BurgerMenuProvider>
    </AuthProvider>
  )
  }
