changeMode();
layoutType();

function changeMode() {
  const navBar = document.getElementById("nav-bar");
  const fullWrapper = document.getElementById("full-wrapper");
  const searchSystem = document.getElementById("search-system");
  const statsContainers = document.getElementsByClassName("stats-containers");
  const activeButtons = document.getElementsByClassName("active-button");
  const searchButton = document.getElementById("search-button");
  const settingContainer = document.getElementById("settings-container");
  const layoutContainer = document.getElementById("layout-type-container");
  const darkMode = document.getElementById("dark-mode-container");
  const waitingBg = document.getElementById("waiting-background");
  const waitingImage = document.getElementById("waiting-man");
  const footer = document.getElementById("container-footer");

  darkMode.addEventListener("click", () => {
    navBar.classList.toggle("nav-light-mode");
    navBar.classList.toggle("nav-dark-mode");
    fullWrapper.classList.toggle("light-mode-full-wrapper");
    fullWrapper.classList.toggle("dark-mode-full-wrapper");
    searchSystem.classList.toggle("light-mode-search-system");
    searchSystem.classList.toggle("dark-mode-search-system");
    searchButton.classList.toggle("search-button-light-mode");
    searchButton.classList.toggle("search-button-dark-mode");
    settingContainer.classList.toggle("settings-light-mode");
    settingContainer.classList.toggle("settings-dark-mode");

    for (i = 0; i < statsContainers.length; i++) {
      statsContainers[i].classList.toggle("light-mode-stats");
      statsContainers[i].classList.toggle("dark-mode-stats");
    }

    for (i = 0; i < activeButtons.length; i++) {
      activeButtons[i].classList.toggle("active-button-light");
      activeButtons[i].classList.toggle("active-button-dark");
    }

    layoutContainer.classList.toggle("layout-light");
    layoutContainer.classList.toggle("layout-dark");
    darkMode.classList.toggle("dark-mode-inactive");
    darkMode.classList.toggle("dark-mode-active");
    waitingBg.classList.toggle("waiting-light-mode");
    waitingBg.classList.toggle("waiting-dark-mode");
    if (waitingBg.classList.contains("waiting-light-mode")) {
      waitingImage.src = "static/fixtures/icon-waiting-blue.png";
    } else {
      waitingImage.src = "static/fixtures/icon-waiting-green.png";
    }

    try {
      // Try and catch with these objects (they are not always present)
      const dinamicStationInfo = document.getElementById("dinamic-station-info");
      const iconBikeDinamic = document.getElementById("icon-bike-dinamic");
      const iconStandDinamic = document.getElementById("icon-stand-dinamic");
      const stationRankings = document.getElementsByClassName("station-rankings");



      dinamicStationInfo.classList.toggle("dinamic-station-info-lightmode");
      dinamicStationInfo.classList.toggle("dinamic-station-info-darkmode");

      for (i = 0; i < stationRankings.length; i++) {
        stationRankings[i].classList.toggle("station-rankings-lightmode");
        stationRankings[i].classList.toggle("station-rankings-darkmode");
      }

      if (darkMode.classList.contains("dark-mode-active")) {
        iconBikeDinamic.src = "static/fixtures/icon-bike-darkmode.png";
        iconStandDinamic.src = "static/fixtures/icon-parking-green.png";
      } else {
        iconBikeDinamic.src = "static/fixtures/icon-bike-blue.png";
        iconStandDinamic.src = "static/fixtures/icon-parking.png";
      }
    } catch (error) {
      console.log(error);
    }

    footer.classList.toggle("footer-light-mode");
    footer.classList.toggle("footer-dark-mode");
  });
}

function layoutType() {
  const fullWrapper = document.getElementById("full-wrapper");
  const wrapperControlBar = document.getElementById("wrapper-control-bar");
  const searchSystem = document.getElementById("search-system");
  const settings = document.getElementById("settings-container");
  const layout1 = document.getElementById("layout1");
  const layout2 = document.getElementById("layout2");
  const layout3 = document.getElementById("layout3");

  layout1.addEventListener("click", () => {
    fullWrapper.classList.remove("full-wrapper-layout2");
    fullWrapper.classList.remove("full-wrapper-layout3");
    wrapperControlBar.classList.remove("wrapper-control-bar-layout3");
    searchSystem.classList.remove("search-system-layout3");
    settings.classList.remove("settings-container-layout3");
    fullWrapper.classList.add("full-wrapper-layout1");
    wrapperControlBar.classList.add("wrapper-control-bar-layout1");
    searchSystem.classList.add("search-system-layout1");
    settings.classList.add("settings-container-layout1");
  });

  layout2.addEventListener("click", () => {
    fullWrapper.classList.remove("full-wrapper-layout1");
    fullWrapper.classList.remove("full-wrapper-layout3");
    wrapperControlBar.classList.remove("wrapper-control-bar-layout3");
    searchSystem.classList.remove("search-system-layout3");
    settings.classList.remove("settings-container-layout3");
    fullWrapper.classList.add("full-wrapper-layout2");
    wrapperControlBar.classList.add("wrapper-control-bar-layout1");
    searchSystem.classList.add("search-system-layout1");
    settings.classList.add("settings-container-layout1");
  });

  layout3.addEventListener("click", () => {
    fullWrapper.classList.remove("full-wrapper-layout1");
    fullWrapper.classList.remove("full-wrapper-layout2");
    wrapperControlBar.classList.remove("wrapper-control-bar-layout1");
    searchSystem.classList.remove("search-system-layout1");
    settings.classList.remove("settings-container-layout1");
    fullWrapper.classList.add("full-wrapper-layout3");
    wrapperControlBar.classList.add("wrapper-control-bar-layout3");
    searchSystem.classList.add("search-system-layout3");
    settings.classList.add("settings-container-layout3");
  });
}
