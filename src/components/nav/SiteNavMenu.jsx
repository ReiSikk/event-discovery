"use client";

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import styles from "./SiteNavMenu.module.css";
import classNames from "classnames";
import Link from "next/link";
import { useAuth } from "@/pages/api/auth/authprovider";

const SiteNavMenu = () => {
	const { isLoggedIn } = useAuth();

	return (
		<NavigationMenu.Root className={styles.Root}>
			<NavigationMenu.List className={styles.MenuList}>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger className={styles.Trigger}>
						Browse <CaretDownIcon className={styles.CaretDown} aria-hidden />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={styles.Content}>
						<ul className={`${styles.List} one`}>
							<li style={{ gridRow: "span 3" }}>
								<NavigationMenu.Link asChild>
									<Link className={styles.Callout} href="/">
										<h1>LEIA</h1>
										<p className={styles.CalloutText}>
											Discover events tailored to your interests
										</p>
									</Link>
								</NavigationMenu.Link>
							</li>

							<ListItem href="/home" title="Browse">
								Browse and explore events.
							</ListItem>
							<ListItem href="/home" title="Events near you">
								Beautiful, thought-out palettes with auto dark mode.
							</ListItem>
							<ListItem href="/home?popular" title="Most popular events">
								Most sought after events right now
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger className={styles.Trigger}>
						Create Event  <CaretDownIcon className={styles.CaretDown} aria-hidden />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content className={styles.Content}>
						<ul className={`${styles.List} two`}>
							<ListItem
							className={styles.ListItem}
								title="Publish your event/activity"
								href="/event/create"
							>
							  Host your event or activity on LEIA
							</ListItem>
							<ListItem
							className={styles.ListItem}
								title={isLoggedIn ? "My Profile" : "Log in"}
								href={isLoggedIn ? "/profile" : "/login"}
							>
								{isLoggedIn ? "Manage your published and liked events " : "Create an account to start publishing and saving events."}
							</ListItem>
							<ListItem
							className={styles.ListItem}
							 title="Not sure where to start?" 
							 href="/organiser">
								Check out our FAQ
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link
						className={styles.Link}
						href="/organiser"
					>
						For Organisers
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator className={styles.Indicator}>
					<div className={styles.Arrow} />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div className={styles.ViewportPosition}>
				<NavigationMenu.Viewport className={styles.Viewport} />
			</div>
		</NavigationMenu.Root>
	);
};

const ListItem = React.forwardRef(
	({ className, children, title, ...props }, forwardedRef) => (
		<li>
			<NavigationMenu.Link asChild>
				<a
					className={classNames(styles.ListItemLink, className)}
					{...props}
					ref={forwardedRef}
				>
					<div className={styles.ListItemHeading}>{title}</div>
					<p className={styles.ListItemText}>{children}</p>
				</a>
			</NavigationMenu.Link>
		</li>
	),
);
ListItem.displayName = "ListItem";

SiteNavMenu.displayName = "SiteNavMenu";

export default SiteNavMenu;
