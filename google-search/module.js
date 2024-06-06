let somiibo;
let settings;

async function main(mod) {
  somiibo = mod;

  // Save user-supplied settings to a variable
  await somiibo.initialize(() => {
    settings = somiibo.getSetting();
  });

  // If we made it to a site that is not Google, restart the loop
  if (!somiibo.browser().getURL().match(/google.com/)) {
    await somiibo.wait(5000); // Wait for 5 seconds before restarting
    return restartBrowser();
  }

  // Type the keyword into the search bar and press Enter
  await somiibo.browser().type([settings.keyword, 'Enter']);

  // Wait for the search results to load
  await somiibo.wait(3000, 5000);

  // Function to find and click the target H3 tag
  async function findAndClickTarget() {
    const result = await somiibo.browser().execute((targetHeading) => {
      const headings = Array.from(document.querySelectorAll('h3'));
      for (let heading of headings) {
        if (heading.innerText.includes(targetHeading)) {
          heading.scrollIntoView({behavior: 'smooth', block: 'center'});
          heading.click();
          return true;
        }
      }
      return false;
    }, {
      arguments: [settings.targetHeading]
    });

    return result.success && result.result;
  }

  let linkFound = await findAndClickTarget();

  // If not found, scroll and try again
  while (!linkFound) {
    await somiibo.browser().scroll(undefined, {offsetY: 3000});
    await somiibo.wait(3000, 5000);
    linkFound = await findAndClickTarget();
  }

  // Simulate some dwell time on the target page
  await somiibo.wait(5000, 10000);
  somiibo.log("Dwell time on the target page completed");

  // Close the current browser window and restart the loop
  await somiibo.browser().close();
  return restartBrowser();
}

async function restartBrowser() {
  // Wait for 5 seconds before restarting
  await somiibo.wait(5000);

  // Restart the loop
  somiibo.loop(main, 5000); // Restart the loop after 5 seconds
}

module.exports = main;
