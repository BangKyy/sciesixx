import { getCookie } from "../lib/cookie.js";
import { Sidebar, SidebarArrow } from "../utils/sidebar.js";

const changeNavColor = (document, scrollY, scrolls = [], colors = []) => {
  const nav = document.querySelector(".nav");
  const scrollPositions = scrolls.length ? scrolls : [0, 680, 2200];
  const bgColors = colors.length ? colors : ["#a4bad6", "#e8eef5", "#dde8f7"];
  const currentScrollPositions = scrollPositions.filter(
    (position) => position <= scrollY
  );
  const bgColorsIndex = currentScrollPositions.length - 1;
  nav.style.backgroundColor = bgColors[bgColorsIndex];
};

const toggleNavShadow = (document, scrollY) => {
  const nav = document.querySelector(".nav");
  const boxShadow = "0 1px 2px 0.1px #00000020";
  nav.style.boxShadow = scrollY > 50 ? boxShadow : "none";
};

const toggleSignBtn = (document, selector = null, targetPath = null) => {
  selector = selector || ".sign-btn-container";
  const signBtnContainer = document.querySelector(selector);
  const origin = encodeURIComponent(window.location.href);
  targetPath = `${targetPath || "./logout"}?last_origin=${origin}`;
  const logOutElement = `
        <a href="${targetPath}" class="sign-btn logout-btn btn btn-sm btn-outline-primary text-primary">
            <i class="bi bi-box-arrow-left"></i>&nbsp;&nbsp;<span>Keluar</span>
        </a>
    `;
  const userData = getCookie(document, { name: "user" });
  const teacherData = getCookie(document, { name: "teacher" });

  if (!(userData || teacherData)) return;
  const newClassName = `${selector}--logout`.split(".")[1];
  signBtnContainer.classList.add(newClassName);
  signBtnContainer.innerHTML = logOutElement;
};

const initSidebar = (element = null, btn = null, bars = []) => {
  const select = document.querySelector.bind(document);
  const selectAll = document.querySelectorAll.bind(document);
  element ? 0 : (element = select(".sidebar"));
  btn ? 0 : (btn = select(".menu-icon"));
  bars.length ? 0 : (bars = selectAll(".menu-bar"));
  new Sidebar(element, btn, bars).init({ hidden: true });
};

const initSidebarArrow = (parentElements = null, arrowElements = null) => {
  const btnParent = document.querySelector(".menu-icon");
  const parents =
    parentElements || document.querySelectorAll(".sidebar-arrow-list > p a");
  const arrows =
    arrowElements || document.querySelectorAll(".sidebar-arrow-list > p .bi");
  parents.forEach((parent, i) => {
    const collapsed = document.querySelectorAll(
      ".sidebar-arrow-list > p .collapsed"
    )[i];
    const collapseSidebar = document.querySelectorAll(".collapse-sidebar")[i];
    SidebarArrow.objects.push(
      new SidebarArrow(
        arrows[i],
        parent,
        collapsed,
        collapseSidebar,
        btnParent,
        i
      )
    );
    SidebarArrow.objects[i].init();
  });
};

const getPathRoot = (hostname) => {
  const { protocol } = location;
  const isLocalhost = hostname === "localhost";
  //   const prodRoot = "/";
  const prodRoot = "/sciesixx/";
  const root = isLocalhost ? `${protocol}//localhost/sciesixx/` : "/";
  return root;
};

const redirectToAccount = () => {
  const hostname = location.hostname;
  const pathRoot = getPathRoot(hostname);
  const targetUrl = pathRoot + "account/";
  location.assign(targetUrl);
};

const initUsernameEvent = () => {
  const elements = [
    document.querySelector(".nav-username-icon"),
    document.querySelector(".nav-username-text"),
    document.querySelector(".sidebar-username-icon"),
    document.querySelector(".sidebar-username-text"),
  ];
  elements.forEach((element) => {
    element.addEventListener("click", () => {
      redirectToAccount();
    });
  });
};

const checkUsername = () => {
  const username = getCookie(document, { name: "username" });
  const teacher = getCookie(document, { name: "teacher" });
  const teacherName = "GURU";
  if (!(username || teacher)) return;
  const containerSidebar = document.querySelector(".sidebar-username-list");
  const containerNav = document.querySelector(".nav-username-container");
  const usernameSidebar = document.querySelector(".sidebar-username-text");
  const usernameNav = document.querySelector(".nav-username-text");

  containerSidebar.classList.remove("sidebar-list-hidden");
  containerNav.classList.remove("nav-username-container-hidden");
  usernameSidebar.innerHTML = username ? username : teacherName;
  usernameNav.innerHTML = username ? username : teacherName;

  initUsernameEvent();
};

export {
  changeNavColor,
  toggleNavShadow,
  toggleSignBtn,
  initSidebar,
  initSidebarArrow,
  initUsernameEvent,
  checkUsername,
};
