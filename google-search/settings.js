let settings;
async function main(mod) {
  settings = mod;

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettings();
  });

  function saveSettings() {
    const keyword = document.getElementById('keyword').value;
    const targetHeading = document.getElementById('targetHeading').value;

    const settingsData = {
      keyword: keyword,
      targetHeading: targetHeading
    };

    settings.save(settingsData);
  }

  settings.load().then((loadedSettings) => {
    document.getElementById('keyword').value = loadedSettings.keyword || '';
    document.getElementById('targetHeading').value = loadedSettings.targetHeading || '';
  });
}

module.exports = main;
