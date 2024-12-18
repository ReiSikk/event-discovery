import FooterNav from './nav/FooterNav'
import SiteNav from './nav/SiteNav'
 
export default function Layout({ children }) {
  return (
    <>
      <SiteNav />
      {children}
      <FooterNav />
    </>
  )
}