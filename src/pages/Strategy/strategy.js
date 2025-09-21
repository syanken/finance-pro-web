import { useState, useEffect } from 'react';
import './strategy.css';

function Strategy() {
	return (
		<>
			<div id='strategy-selector-container'>
				<div className='row-container'>
					<div className='fp-btn' id='strategy-selector-variety-btn'>
						品种选择
					</div>
					<div className='fp-btn' id='strategy-selector-backtest-btn'>
						回测交易
					</div>
				</div>
				<div className='search-container'>
					<input type='text' placeholder='请输入名称' />
					<button>搜索</button>
				</div>
				<div id='strategy-list' className='list'></div>
				<div className='row-container'>
					<div id='add-strategy-btn' className='fp-btn'>
						添加策略
					</div>
					<div id='man-strategy-btn' className='fp-btn' value='off'>
						管理策略
					</div>
				</div>
			</div>
			{/* <!-- 第二列 --> */}
			<div id='strategy-info-container'>
				<div className='row-container'>
					<div className='close-open-btn'>❮</div>
					<div>详细信息</div>
				</div>
				<div className='row-container'>
					<div>
						<div className='row-container'>
							<div>名称</div>
							<input id='strategy-des-name-input' type='text' />
						</div>
						<div className='row-container'>
							<div>描述</div>
							<input id='strategy-des-content-input' type='text' />
						</div>
					</div>
					<div className='btn-container'>
						<div className='fp-btn'>保存</div>
						<div className='fp-btn'>重置</div>
						<div className='fp-btn' id='apply-btn'>
							应用
						</div>
					</div>
				</div>

				<div className='border-container' id='selector'>
					<div>条件</div>
					<div>范围</div>
					<div className='row-container'>
						<div className='listItem'>沪深主板</div>
						<div className='listItem'>上证主板</div>
						<div className='listItem'>深证主板</div>
						<div className='listItem'>北交所</div>
						<div className='listItem'>科创板</div>
						<div className='listItem'>创业板</div>
					</div>
					<div>行情</div>
					<div className='row-container'>
						<div className='listItem'>换手率</div>
						<div className='listItem'>量比</div>
						<div className='listItem'>成交量</div>
						<div className='listItem'>成交额</div>
					</div>
				</div>
				<div className='border-container' id='code-container'>
					<div>代码</div>
					<div id='code_editor'></div>
				</div>
			</div>
			{/* <!-- 第三列 --> */}
			<div id='strategy-result-container'>
				<div>回测结果</div>
				<div id='strategy-result-history'>
					<div className='row-container'>
						<div>序号</div>
						<div>回测时间</div>
						<div>操作</div>
					</div>
					<div className='list'>
						<div className='row-container'>
							<div>1</div>
							<div>2020-10-12</div>
							<div>
								<button>删除</button>
							</div>
						</div>
					</div>
				</div>
				<div id='strategy-result-content'>
					<div className='row-container'>
						<div className='name-code-container'>名称/代码</div>
						<div className='scrollable-col'>
							<div className='inner'>价格 </div>
							<div className='inner'>涨跌幅 </div>
							<div className='inner'>成交量 </div>
							<div className='inner'>换手率 </div>
							<div className='inner'>成交额 </div>
						</div>
					</div>

					<div className='list' id='strategy-result-list'></div>
				</div>
			</div>
		</>
	);
}
export default Strategy;
