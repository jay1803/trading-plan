import React from "react";
import ReactDOM from "react-dom/client";
import { Theme, Container } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider attribute="class">
            <Theme
                accentColor="crimson"
                grayColor="slate"
                radius="large"
                scaling="95%"
            >
                <Container p="8" size="1">
                    <App />
                </Container>
            </Theme>
        </ThemeProvider>
        <Analytics />
    </React.StrictMode>
);
