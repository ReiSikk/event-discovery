import SiteNav from './SiteNav'
 
export default function Layout({ children }) {
  return (
    <>
      <SiteNav />
      {children}
    </>
  )
}