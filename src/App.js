import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Quote from './pages/Quote/quote';
import Strategy from './pages/Strategy/strategy';
import './styles/global.css';
function Home() {
	return <h1>Home1</h1>;
}

function Backtest() {
	return <h1>Backtest</h1>;
}

function App() {
	return (
		<BrowserRouter>
			<div className='header'>
				<Link to='/' className='header-btn'>
					Finance Pro
				</Link>
				<hr />
				<div className='row-container'>
					<NavLink to='/' className={({ isActive }) => 'header-btn' + (isActive ? ' active' : '')}>
						首页
					</NavLink>
					<NavLink to='/quote' className={({ isActive }) => 'header-btn' + (isActive ? ' active' : '')}>
						行情
					</NavLink>
					<NavLink to='/strategy' className={({ isActive }) => 'header-btn' + (isActive ? ' active' : '')}>
						策略
					</NavLink>
					<NavLink to='/backtest' className={({ isActive }) => 'header-btn' + (isActive ? ' active' : '')}>
						回测
					</NavLink>
				</div>
				<hr />
				<div>
					<button className='header-btn'>交易</button>
				</div>
				<hr />
				<div className='space'></div>
				<hr />
				<div>
					<button className='header-btn'>设置</button>
				</div>
				<hr />
				<div>
					<button className='header-btn'>登录</button>
				</div>
			</div>
			<div className='page'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/quote' element={<Quote />} />
					<Route path='/strategy' element={<Strategy />} />
					<Route path='/backtest' element={<Backtest />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
export default App;
