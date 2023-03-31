import { Suspense, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../redux/customise/customiseActions";

// Router
import {
    BrowserRouter,
    Redirect,
    Route,
    Switch,
    useHistory,
} from "react-router-dom";

// Routes
import { Routes } from "./routes";

// Layouts
import VerticalLayout from "../layout/VerticalLayout";
import HorizontalLayout from "../layout/HorizontalLayout";
import FullLayout from "../layout/FullLayout";

// Components
import Analytics from "../view/anss/dashboard/index";
import Error404 from "../view/pages/errors/404";

import Login from "../view/pages/authentication/login";
import Register from "../view/anss/users/Register";

export default function Router() {
    // Redux
    const customise = useSelector(state => state.customise)
    const dispatch = useDispatch()

    const { isLoggedIn } = useSelector(state => state.auth);

    // Location
    const location = useHistory()

    // Dark Mode
    let themeLocal

    useEffect(() => {
        if (localStorage) {
            themeLocal = localStorage.getItem("theme")
        }

        if (themeLocal === "light" || themeLocal === "dark") {
            document.querySelector("body").classList.add(themeLocal)
            dispatch(theme(themeLocal))
        } else {
            document.querySelector("body").classList.add(customise.theme)
            dispatch(theme(customise.theme))
        }
    }, [])

    // RTL
    useEffect(() => {
        if (customise.direction == "ltr") {
            document.querySelector("html").setAttribute("dir", "ltr");
        } else if (customise.direction == "rtl") {
            document.querySelector("html").setAttribute("dir", "rtl");
        }
    }, [])

    // Url Check
    useEffect(() => {
        // Theme
        if (location.location.search == "?theme=dark") {
            localStorage.setItem("theme", "dark")
            themeLocal = "dark"
        } else if (location.location.search == "?theme=light") {
            localStorage.setItem("theme", "light")
            themeLocal = "light"
        }

        // Direction
        if (location.location.search == "?direction=ltr") {
            document.querySelector("html").setAttribute("dir", "ltr");
        } else if (location.location.search == "?direction=rtl") {
            document.querySelector("html").setAttribute("dir", "rtl");
        }
    }, [])

    // Default Layout
    const DefaultLayout = customise.layout; // FullLayout or VerticalLayout

    // All of the available layouts
    const Layouts = { VerticalLayout, HorizontalLayout, FullLayout };

    // Return Filtered Array of Routes & Paths
    const LayoutRoutesAndPaths = (layout) => {
        const LayoutRoutes = [];
        const LayoutPaths = [];
        if (Routes) {
            // Checks if Route layout or Default layout matches current layout
            Routes.filter(route => (route.layout === layout) && (
                LayoutRoutes.push(route),
                LayoutPaths.push(route.path)
            ));
        }

        return { LayoutRoutes, LayoutPaths };
    };

    // Return Route to Render
    const ResolveRoutes = () => {
        return Object.keys(Layouts).map((layout, index) => {
            const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths(layout);
     
            let LayoutTag;
            if (DefaultLayout == "HorizontalLayout") {
                if (layout == "VerticalLayout") {
                    LayoutTag = Layouts["HorizontalLayout"];
                } else {
                    LayoutTag = Layouts[layout];
                }
            } else {
                LayoutTag = Layouts[layout];
            }

            return (
                <Route path={LayoutPaths} key={index}>
                    <LayoutTag>
                        <Switch>
                            {LayoutRoutes.map((route) => {
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        exact={route.exact === true}
                                        element={route.element}
                                        render={(props) => {
                                            return isLoggedIn ?
                                                <Suspense fallback={null}>
                                                    <route.component {...props} />
                                                </Suspense>

                                            : <Redirect to="/login"/>

                                        }}
                                    />
                                );
                            })}
                        </Switch>
                    </LayoutTag>
                </Route>
            );
        });
    };

    return (
        <BrowserRouter>
            <Switch>
                {ResolveRoutes()}

                {/* Home Page */}
                <Route
                    exact
                    path={'/'}
                    render={() => {
                        return (
                            DefaultLayout == "HorizontalLayout" ? (
                                <Layouts.HorizontalLayout>
                                    <Analytics />
                                </Layouts.HorizontalLayout>
                            ) : (
                                <Layouts.VerticalLayout>
                                    <Analytics />
                                </Layouts.VerticalLayout>
                            )
                        )
                    }}
                />

                {/** LOGIN */}

                <Route path="/login" >
                    <FullLayout>
                        <Login />
                    </FullLayout>
                </Route>

                <Route path="/register/:token" >
                    <FullLayout>
                        <Register/>
                    </FullLayout>
                </Route>

                {/* NotFound */}
                <Route path='*'>
                    <Error404 />
                </Route>

            </Switch>
        </BrowserRouter>
    );
};