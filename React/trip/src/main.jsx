import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'react-vant'
import './index.css'
import 'lib-flexible'

import App from './App.jsx'

// 移动端适配

createRoot(document.getElementById('root')).render(

  <Router>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </Router>

)
