// Twitter Follow Automation Script
const Twitter = {
    config: {
      scrollDelay: 1000,
      actionDelay: 2000,
      nextPageDelay: 2000,
      maxFollows: 50,
      totalFollowed: 0,
      isRunning: false
    },

    sendMessage: function(type, data) {
      console.log('📤 Sending message:', type, data);
      chrome.runtime.sendMessage({ type, ...data });
    },

    log: function(message) {
      console.log('📝', message);
      this.sendMessage('log', { text: message });
    },

    updateStats: function(config) {
      console.log('📊 Updating stats:', config.totalFollowed);
      this.sendMessage('stats', { totalInvites: config.totalFollowed });
    },

    init: function(data, config) {
      console.log('🎬 Initializing Twitter automation with config:', config);
      this.log("🚀 Starting Twitter automation...");
      this.log("⚙️ Configuration: " + JSON.stringify({
        scrollDelay: config.scrollDelay,
        actionDelay: config.actionDelay,
        maxFollows: config.maxFollows,
        totalFollowed: config.totalFollowed
      }));
      this.log("ℹ️ Type 'exit' in console to stop the automation");

      // Add console listener for exit command
      const originalConsoleLog = console.log;
      console.log = function() {
        if (arguments[0]?.toLowerCase() === 'exit') {
          console.log = originalConsoleLog;
          console.log('🛑 Exit command received');
          config.isRunning = false;
          this.log("🛑 Stopping automation...");
          this.sendMessage('status', { text: 'Stopped' });
          return;
        }
        originalConsoleLog.apply(console, arguments);
      }.bind(this);

      if (config.isRunning) {
        console.log('▶️ Starting automation sequence');
        setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
      } else {
        console.log('⏹️ Automation not running, stopping init');
      }
    },

    scrollBottom: function(data, config) {
      if (!config.isRunning) {
        console.log('⏹️ Stopping at scroll bottom');
        this.complete(config);
        return;
      }
      console.log('⬇️ Scrolling to bottom');
      this.log("📜 Scrolling to bottom of page...");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
    },

    scrollTop: function(data, config) {
      if (!config.isRunning) {
        console.log('⏹️ Stopping at scroll top');
        this.complete(config);
        return;
      }
      console.log('⬆️ Scrolling to top');
      this.log("📜 Scrolling back to top...");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => this.inspect(data, config), config.scrollDelay);
    },

    inspect: function(data, config) {
      if (!config.isRunning) {
        console.log('⏹️ Stopping at inspect');
        this.complete(config);
        return;
      }
      console.log('🔍 Starting inspection');
      const followButtons = document.querySelectorAll('div[data-testid="follow"]');
      const totalButtons = followButtons.length;
      console.log('🔢 Total buttons found:', totalButtons);
      this.log(`🔍 Found ${totalButtons} follow buttons on current page`);
      
      if (totalButtons > 0) {
        data.pageButtons = [...followButtons].filter(button => 
          button.textContent.trim() === "Follow"
        );
        console.log('✨ Filtered unfollowed accounts:', data.pageButtons.length);
        this.log(`🎯 Found ${data.pageButtons.length} unfollowed accounts`);
        if (data.pageButtons.length > 0) {
          data.pageButtonTotal = data.pageButtons.length;
          data.pageButtonIndex = 0;
          console.log('▶️ Starting follow sequence');
          this.followUsers(data, config);
        } else {
          console.log('⏭️ No new accounts, checking next page');
          this.log("❌ No new accounts to follow on this page!");
          this.checkForNextPage(config);
        }
      } else {
        console.log('⚠️ No buttons found, completing');
        this.log("⚠️ No follow buttons found on page!");
        this.complete(config);
      }
    },

    followUsers: function(data, config) {
      if (!config.isRunning || config.maxFollows === 0) {
        console.log('⏹️ Stopping follow sequence:', { running: config.isRunning, maxFollows: config.maxFollows });
        this.log("🛑 Stopping automation...");
        this.complete(config);
        return;
      }

      if (config.totalFollowed >= config.maxFollows) {
        console.log('🎯 Max follows reached:', config.totalFollowed);
        this.log("🎯 Reached maximum follow limit!");
        this.complete(config);
        return;
      }

      console.log('👤 Following account', data.pageButtonIndex + 1, 'of', data.pageButtonTotal);
      this.log(`✉️ Following account ${data.pageButtonIndex + 1} of ${data.pageButtonTotal}`);
      const button = data.pageButtons[data.pageButtonIndex];
      console.log('🖱️ Clicking follow button');
      button.click();
      
      config.maxFollows--;
      config.totalFollowed++;
      console.log('📊 Updated counts:', { maxFollows: config.maxFollows, totalFollowed: config.totalFollowed });
      this.updateStats(config);
      this.log(`📊 Progress: ${config.totalFollowed} accounts followed`);

      if (data.pageButtonIndex === data.pageButtonTotal - 1) {
        console.log('📄 End of page reached');
        this.log("📄 Reached end of current page");
        setTimeout(() => this.checkForNextPage(config), config.actionDelay);
      } else {
        console.log('⏭️ Moving to next account');
        data.pageButtonIndex++;
        setTimeout(() => this.followUsers(data, config), config.actionDelay);
      }
    },

    checkForNextPage: function(config) {
      if (!config.isRunning) {
        console.log('⏹️ Stopping at next page check');
        this.complete(config);
        return;
      }
      console.log('🔍 Looking for next page button');
      const nextPageButton = document.querySelector('div[role="button"][aria-label="Next"]');
      console.log('🔘 Next page button found:', !!nextPageButton);
      if (nextPageButton && !nextPageButton.hasAttribute('disabled')) {
        console.log('➡️ Moving to next page');
        this.log("➡️ Moving to next page");
        nextPageButton.click();
        this.sendMessage('nextPage');
        setTimeout(() => this.init({}, config), config.nextPageDelay);
      } else {
        console.log('🏁 No more pages');
        this.log("🏁 No more pages available");
        this.complete(config);
      }
    },

    complete: function(config) {
      console.log('🎉 Completing automation');
      this.log("🎉 Automation completed!");
      console.log('📈 Final stats:', { totalFollowed: config.totalFollowed });
      this.log(`📈 Final Results: Followed ${config.totalFollowed} accounts`);
      this.sendMessage('status', { text: 'Completed' });
      config.isRunning = false;
      console.log('⏹️ Automation stopped');
    }
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Message received:', message);
  if (message.command === 'start') {
    console.log('▶️ Start command received');
    Twitter.config.isRunning = true;
    Twitter.init({}, Twitter.config);
  } else if (message.command === 'stop') {
    console.log('⏹️ Stop command received');
    Twitter.config.isRunning = false;
  }
});