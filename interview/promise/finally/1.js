showLoading();
fetchData().then(render).catch(showError).finally(hideLoading);
