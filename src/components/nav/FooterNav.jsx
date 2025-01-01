import Link from 'next/link'
import React from 'react'

function FooterNav() {
  return (
    <>
    <footer className='siteFooter'>
        <div className="siteFooter__wrap container">
            <div className="siteFooter__contacts">
                <h2>LEIA</h2>
                <p className='contact_desc'>
                    Discover events tailored to your interests.
                </p>
                <div className="info">
                    <p className='txt-small'>Valukoja 18A</p>
                    <p className='txt-small'>Tallinn, Estonia</p>
                    <a href="tel:+372 555555555" className='txt-small'>+372 55008922</a>
                </div>
            </div>
            <div className="siteFooter__main">
                <div className="quickLinks footerList">
                    <h4 className='txt-medium'>Quick Links</h4>
                    <Link href="/home" className='txt-small'>Home</Link>
                    <Link href="/organiser" className='txt-small'>For Organisers</Link>
                    <Link href="/event/create" className='txt-small'>Create Event</Link>
                </div>
                <div className="footer__social footerList">
                    <h4 className='txt-medium'>Socials</h4>
                    <a href="https://www.facebook.com/" className='txt-small'>Facebook</a>
                    <a href="https://www.instagram.com/" className='txt-small'>Instagram</a>
                    <a href="https://www.twitter.com/" className='txt-small'>X</a>
                </div>
                <div className="footer__legal footerList">
                    <h4 className='txt-medium'>Legal</h4>
                    <Link href="#" className='txt-small'>Terms of Use</Link>
                    <Link href="#" className='txt-small'>Privacy Policy</Link>
                </div>
            </div>
        </div>
    </footer>
    </>
  )
}

export default FooterNav