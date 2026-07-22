import { useState, useEffect, useRef } from 'react';
import { api, trace } from "@ninebone/util";
import ninegrid from "@ninebone/grid";
import { useScreen } from '@ninebone/mu';
import Example1Detail from "./NineExample1Detail";
import Example1Popup from "./NineExample1Popup";

const Example1 = () => {
	const { goto, selectedData } = useScreen();
	const [activeView, setActiveView] = useState('list-wrapper'); // 필요 시 유지
	const tabRef = useRef(null);
	const gridRef = useRef(null);
	const deckRef = useRef(null);

	// 📊 목록 조회 함수
	const selectList = () => {
		if (gridRef.current?.data) {
			gridRef.current.data.source = [
				{ userId: "1", userName: "홍길동", role: "ADMIN", email: "dong@nine.com", tel: "010-1234-****", gender: "MALE", status: "ACTIVE" },
				{ userId: "2", userName: "홍길순", role: "USER", email: "soon@nine.com", tel: "010-5678-****", gender: "FEMALE", status: "ACTIVE" }
			];
		}
	};

	// 🎯 [핵심 추가] 상세 화면에서 '이전으로' 돌아올 때 데이터 수신 핸들러
	const handleMainActive = (deliveryData) => {
		trace.log("[main] 화면 활성화 신호 수신. 전달받은 데이터:", deliveryData);

		// 상세 화면에서 넘겨준 커스텀 영수증 포맷(예: { refresh: true })에 맞춰 "알아서" 요리
		if (deliveryData?.refresh === true) {
			trace.log("데이터 변경 건이 확인되어 목록을 재조회합니다.");
			selectList();
		}
	};

	// 첫 마운트 시 최초 조회 수행
	useEffect(() => {
		setTimeout(() => {
			selectList();
		});
	}, []);

	// DOM 이벤트 리스너 생명주기 관리
	useEffect(() => {

		// 엔터키 검색 핸들러
		const handleSearchTextKeydown = (e) => {
			if (e.key === 'Enter' && !e.isComposing) {
				selectList();
			}
		};


        // 그리드 버튼 클릭 시 상세로 이동
        const handleGridButtonClick = (e) => {
            if (e.detail?.target?.dataset?.bind === 'btn') {
                nine.popup(Example1Popup, e.detail.data, "상세화면 팝업").then((result) => {
                    trace.log(result);
                });
            }
        };

        // 그리드 내 링크(사용자명) 클릭 시 상세로 이동
		const handleGridLinkClick = (e) => {
			if (e.detail?.target?.dataset?.bind === 'userName') {
				trace.log("사용자명 링크 클릭. 단건 데이터 셔틀:", e.detail.data);
				deckRef.current?.goto("#detail", e.detail.data);
			}
		};

		// 우측 상단 '이동' 버튼 클릭 핸들러 (그리드 소스 전체 전달 예시)
		const handleMoveClick = () => {
			trace.log("이동 버튼 클릭. 전체 데이터 셔틀");
			deckRef.current?.goto("#detail", gridRef.current.data.source);
		};

		// 🎯 5. 돔 엘리먼트 쿼리 (가장 깔끔하게 통합된 라인)
        const $currentTab = tabRef.current ?? undefined;
        const $currentGrid = gridRef.current ?? undefined; // 💡 cleanup 시점의 안전한 참조를 위해 변수 백업

        const $searchText = nine.querySelector("#searchText", $currentTab);
        const $searchBtn = nine.querySelector(".search", $currentTab);
        const $moveBtn = nine.querySelector("#move", $currentGrid);

        // 🔌 6. 리스너 일괄 바인딩 (? . 의 연쇄 마법)
        $searchText?.addEventListener('keydown', handleSearchTextKeydown);
        $searchBtn?.addEventListener('click', selectList);
        $moveBtn?.addEventListener('click', handleMoveClick);

        $currentGrid?.addEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);
        $currentGrid?.addEventListener(ninegrid.EVENT.BUTTON_CLICK, handleGridButtonClick);

        // 🧹 7. Cleanup 함수: 깔끔하게 한 줄씩 완벽 대칭 제거
        return () => {
            $searchText?.removeEventListener('keydown', handleSearchTextKeydown);
            $searchBtn?.removeEventListener('click', selectList);
            $moveBtn?.removeEventListener('click', handleMoveClick);

            $currentGrid?.removeEventListener(ninegrid.EVENT.LINK_CLICK, handleGridLinkClick);
            $currentGrid?.removeEventListener(ninegrid.EVENT.BUTTON_CLICK, handleGridButtonClick);
        };
	}, []);

	return (
		<nine-deck ref={deckRef} router={goto}>
			{/* 🎯 [보완 핵심] 인라인 훅 형태로 공통 활성화 이벤트인 onActive를 가로챕니다. */}
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
							<label><span className="label">사용자 ID:</span><input type="number" name="userId" /></label>
							<label><span className="label">사용자명:</span><input type="text" name="userName" /></label>
							<label><span className="label">역할:</span><input type="text" name="role" placeholder="예: ADMIN, USER" /></label>
							<label><span className="label">이메일:</span><input type="text" name="email" /></label>
							<label><span className="label">연락처:</span><input type="text" name="tel" /></label>
							<label><span className="label">성별:</span><input type="text" name="gender" placeholder="예: MALE, FEMALE" /></label>
							<label><span className="label">상태:</span><input type="text" name="status" placeholder="예: ACTIVE, INACTIVE" /></label>
						</nine-panel>
						<button className="search">검색</button>
					</nine-tab-page>
				</nine-tab>

				<div className="grid-wrapper">
					<nine-grid ref={gridRef} caption="화면이동 예제." select-type="row" auto-fit-col="true" show-title-bar="true" show-menu-icon="true" show-status-bar="true" enable-fixed-col="true" row-resizable="false" col-movable="true">
						<nx-buttons>
							<ng-button id="move" text="상세화면으로 이동"></ng-button>
						</nx-buttons>
						<table>
							<colgroup>
								<col width="50" fixed="left" background-color="gray"/>
								<col width="40"/>
								<col width="100"/>
								<col width="150"/>
								<col width="100"/>
								<col width="200"/>
								<col width="150"/>
								<col width="80"/>
							</colgroup>
							<thead>
								<tr>
									<th>No.</th>
									<th>선택</th>
									<th>사용자 ID</th>
									<th>사용자명</th>
									<th>역할</th>
									<th>이메일</th>
									<th>연락처</th>
									<th>이동</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th><ng-row-indicator/></th>
									<td data-bind="sel"><ng-checkbox true-value="Y" false-value="N" update-row-state="false"></ng-checkbox></td>
									<td data-bind="userId"></td>
									{/* 그리드 링크 이벤트가 정상 매핑됩니다. */}
									<td data-bind="userName"><ng-renderer link="true"/></td>
									<td data-bind="role"></td>
									<td data-bind="email"></td>
									<td data-bind="tel"></td>
									<td data-bind="btn"  data-expr="'[' + data.userName + '] 상세'"><ng-button /></td>
								</tr>
							</tbody>
						</table>
					</nine-grid>
				</div>
			</nine-deck-page>

			<nine-deck-page id="detail" back-target="#main">
				<Example1Detail data={selectedData} key={JSON.stringify(selectedData || {})} />
			</nine-deck-page>

			<nine-deck-page id="detail2" back-target="#detail"></nine-deck-page>
		</nine-deck>
	);
};

export default Example1;