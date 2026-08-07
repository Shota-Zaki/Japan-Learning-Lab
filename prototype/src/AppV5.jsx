import { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { FeLearningApp } from "./FeLearningApp.jsx";
import { PlatformHeader, JapanHome, EngineerHome } from "./PlatformShell.jsx";

const appBase = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

function appPath(relativePath = "") {
  const clean = String(relativePath).replace(/^\/+/, "");
  return `${appBase}${clean}`.replace(/\/{2,}/g, "/");
}

function routeParams() {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return {
    get(name) {
      return hash.has(name) ? hash.get(name) : query.get(name);
    },
  };
}

function readRoute() {
  const params = routeParams();
  const explicit = params.get("screen");
  const tab = params.get("tab") || (params.get("mode") === "lesson" ? "lesson" : "practice");
  const view = params.get("view") === "session" ? "session" : "home";
  if (["japan", "engineer", "fe"].includes(explicit)) return { screen: explicit, tab, view };
  const baseWithoutSlash = appBase.replace(/\/$/, "");
  let path = window.location.pathname;
  if (baseWithoutSlash && path.startsWith(baseWithoutSlash)) path = path.slice(baseWithoutSlash.length);
  if (path.startsWith("/docs")) path = path.slice(5);
  if (path.startsWith("/engineer/it-exam/practice/session")) return { screen: "fe", tab: "practice", view: "session" };
  if (path.startsWith("/engineer/it-exam/history")) return { screen: "fe", tab: "history", view: "home" };
  if (path.startsWith("/engineer/it-exam/practice")) return { screen: "fe", tab: "practice", view: "home" };
  if (path.startsWith("/engineer/it-exam")) return { screen: "fe", tab: "lesson", view: "home" };
  if (path.startsWith("/engineer")) return { screen: "engineer", tab: "home", view: "home" };
  return { screen: "japan", tab: "home", view: "home" };
}

function routePath(screen, tab = "home", view = "home") {
  if (screen === "fe") {
    if (view === "session") return appPath("engineer/it-exam/practice/session/");
    if (tab === "history") return appPath("engineer/it-exam/history/");
    if (tab === "practice") return appPath("engineer/it-exam/practice/");
    return appPath("engineer/it-exam/lessons/");
  }
  if (screen === "engineer") return appPath("engineer/");
  return appPath("");
}

function routeUrl(screen, tab = "home", view = "home") {
  const canonical = routePath(screen, tab, view);
  const hash = new URLSearchParams({ jll: canonical, screen, tab, view }).toString();
  return `${appBase}#${hash}`;
}

export function AppV5() {
  const [route, setRoute] = useState(readRoute);
  const [feHeaderStatus, setFeHeaderStatus] = useState(null);
  const navigate = (screen, tab = "home", view = "home") => {
    const next = { screen, tab, view };
    setRoute(next);
    window.history.pushState({}, "", routeUrl(screen, tab, view));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const current = readRoute();
    window.history.replaceState({}, "", routeUrl(current.screen, current.tab, current.view));
    const onPopState = () => setRoute(readRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const brand = route.screen === "fe" ? "FE Learning Lab" : route.screen === "engineer" ? "Engineer Learning Lab" : "Japan Learning Lab";
  const headerStatus = route.screen === "fe" && route.view === "session" ? feHeaderStatus : null;
  return (
    <div className={`app-shell theme-${route.screen === "fe" ? "exam" : route.screen}`}>
      <PlatformHeader screen={route.screen} tab={route.tab} navigate={navigate} statusText={headerStatus} />
      {route.screen === "japan" && <JapanHome navigate={navigate} />}
      {route.screen === "engineer" && <EngineerHome navigate={navigate} />}
      {route.screen === "fe" && <FeLearningApp tab={route.tab} view={route.view} navigate={(tab, view) => navigate("fe", tab, view)} goEngineer={() => navigate("engineer")} setHeaderStatus={setFeHeaderStatus} />}
      <footer className="site-footer"><span>{brand}</span><button onClick={() => navigate("japan")}><span>Japan Learning Lab Network</span><ArrowUpRight size={17} /></button></footer>
    </div>
  );
}
