import { useState, useEffect, useRef } from 'react';
import { api, trace } from "@ninebone/util";
import ninegrid from "@ninebone/grid";
import { useScreen } from '@ninebone/mu';
import * as echarts from 'echarts';
import 'echarts-gl';

const NineStat = () => {
    const { goto, selectedData } = useScreen();
    const tabRef = useRef(null);
    const gridRef = useRef(null);
    const chartRef = useRef(null); // Canvas DOM 참조용
    const chartInstance = useRef(null); // Chart.js 인스턴스 관리용

   const updateChart = (historyData) => {
           const reversedData = [...historyData].reverse();

           // 차트 초기화
           if (!chartInstance.current) {
               chartInstance.current = echarts.init(chartRef.current);
           }

           const option = {
               tooltip: {},
               visualMap: {
                   max: Math.max(...reversedData.map(d => d.max)),
                   inRange: { color: ['#313695', '#4575b4', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'] }
               },
               xAxis3D: { type: 'category', name: '날짜', data: reversedData.map(d => d.date) },
               yAxis3D: { type: 'value', name: '평균(ms)' },
               zAxis3D: { type: 'value', name: '최대(ms)' },
               grid3D: {
                   boxWidth: 100, boxDepth: 80,
                   viewControl: { projection: 'perspective' },
                   light: { main: { intensity: 1.2 } }
               },
               series: [{
                   type: 'line3D',
                   data: reversedData.map(d => [d.date, d.avg, d.max]),
                   lineStyle: { width: 4 }
               }]
           };

           chartInstance.current.setOption(option);
       };

       // 리사이즈 대응
       useEffect(() => {
           const handleResize = () => chartInstance.current?.resize();
           window.addEventListener('resize', handleResize);
           return () => window.removeEventListener('resize', handleResize);
       }, []);

    const selectList = async (params) => {
        if (!gridRef.current) return;
        const res = await api.post('/nine-mu/stat/query', params);
        console.log(res)
        gridRef.current.data.source = res.list;
    };

    const selectDetail = async (params) => {
        const res = await api.post('/nine-mu/stat/query/detail', params);
        console.log(res)

        if (res.list && res.list.length > 0) {
            updateChart(res.list);
        }
    };

    const handleMainActive = (deliveryData) => {
        if (deliveryData?.refresh === true) {
            //selectList({}); // Refresh data when returning from detail
        }
    };

    useEffect(() => {


        // Initial data load
        selectList({});

        const $currentTab = tabRef.current ?? undefined;
        const $currentGrid = gridRef.current ?? undefined;

        const handleGridLinkClick = (e) => {
            if (e.detail?.target?.dataset?.bind === 'queryId') {
                trace.log("사용자명 링크 클릭. 단건 데이터 셔틀:", e.detail.data);
                selectDetail(e.detail.data);
            }
        };
        $currentGrid?.addEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);

        // Natural language search
        const $searchText = ninegrid.querySelector("#searchText", $currentTab);
        const handleSearchTextKeydown = (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
                selectList({ nineSearchText: e.target.value });
            }
        };
        if ($searchText) {
            $searchText.addEventListener('keydown', handleSearchTextKeydown);
        }

        // Classic search
        const $searchBtn = ninegrid.querySelector(".search", $currentTab);
        const handleSearchButtonClick = () => {
            const params = ninegrid.querySelector(".form2", $currentTab).getData();
            selectList(params);
        };
        if ($searchBtn) {
            $searchBtn.addEventListener('click', handleSearchButtonClick);
        }

        // Grid row click for detail
        const handleGridRowClick = (e) => {
            if (e.detail.data && e.detail.data.id) {
                goto('/local/nationalrestaurant/detail1', { id: e.detail.data.id });
            }
        };
        if ($currentGrid) {
            $currentGrid.addEventListener(ninegrid.EVENT.ROW_CLICK, handleGridRowClick);
        }

        return () => {
            chartInstance.current?.dispose();

            $currentGrid?.removeEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);

            if ($searchText) {
                $searchText.removeEventListener('keydown', handleSearchTextKeydown);
            }
            if ($searchBtn) {
                $searchBtn.removeEventListener('click', handleSearchButtonClick);
            }
            if ($currentGrid) {
                $currentGrid.removeEventListener(ninegrid.EVENT.ROW_CLICK, handleGridRowClick);
            }
        };
    }, []);

    return (
        <nine-deck router={goto}>
            <nine-deck-page id="main" activeCallback={handleMainActive}>
                <nine-collapse target="nine-deck-page nine-tab"></nine-collapse>
                <nine-tab theme="theme-3" ref={tabRef}>
                    <nine-tab-page caption="자연어 검색">
                        <nine-panel className="form1 theme-1" max-column="1">
                            <input type="text" id="searchText" name="searchText" placeholder="자연어 검색어를 입력하세요"/>
                        </nine-panel>
                    </nine-tab-page>
                    <nine-tab-page caption="클래식 검색">
                        <nine-panel className="form2 theme-1" max-column="4">
                            <label><span className="label">맛집명:</span><input type="text" name="tratnm"/></label>
                            <label><span className="label">도로명주소:</span><input type="text" name="roadnmaddr"/></label>
                            <label><span className="label">시도명:</span><input type="text" name="chrgctpvnm"/></label>
                            <label><span className="label">시군구명:</span><input type="text" name="chrgstatnm"/></label>
                            <label><span className="label">ID:</span><input type="text" name="id"/></label>
                        </nine-panel>
                        <button className="search">검색</button>
                    </nine-tab-page>
                </nine-tab>
                <div className="grid-wrapper">
                    <nine-grid ref={gridRef} caption="쿼리 통계" select-type="row" show-title-bar="true" show-menu-icon="true" show-status-bar="true" enable-fixed-col="true" row-resizable="false" col-movable="true">
                        <table>
                            <colgroup>
                                <col width="40" fixed="left" background-color="gray"/>
                                <col width="100"/>
                                <col width="0"/>
                                <col width="200"/>
                                <col width="60"/>
                                <col width="60"/>
                                <col width="60"/>
                                <col width="60"/>
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Query ID</th>
                                    <th>SQL Hash</th>
                                    <th>SQL</th>
                                    <th>min</th>
                                    <th>max</th>
                                    <th>count</th>
                                    <th>avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th><ng-row-indicator/></th>
                                    <td data-bind="queryId"><ng-renderer link="true"/></td>
                                    <td data-bind="sqlHash"></td>
                                    <td data-bind="sql"></td>
                                    <td data-bind="min" text-align="center"></td>
                                    <td data-bind="max" text-align="center"></td>
                                    <td data-bind="count" text-align="center"></td>
                                    <td data-bind="avg" text-align="center"></td>
                                </tr>
                            </tbody>
                        </table>
                    </nine-grid>

                    <nine-splitter/>

                   <div style={{ padding: '31px 0 20px 0', height: '500px', width: '100%' }}>
                                           <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
                                       </div>
                </div>
            </nine-deck-page>
            <nine-deck-page id="detail1" back-target="#main"></nine-deck-page>
        </nine-deck>
    );
};

export default NineStat;