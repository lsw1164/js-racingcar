import Component from "../core/Component";
import { AlertMsg, ID } from "../common/constants";
import { id2Query } from "../common/utils";

interface UserInputState {
  carNameVal?: string;
  raceTimesVal?: number;
  isSubmittedCarName?: boolean;
  isSubmittedRaceTimes?: boolean;
}

const defaultState: UserInputState = {
  isSubmittedCarName: false,
  isSubmittedRaceTimes: false,
};

export default class UserInput extends Component {
  private state: UserInputState;
  constructor($target: HTMLElement, props?: Object) {
    super($target, props);
    this.state = { ...defaultState };
  }
  componentInit() {
    this.bindEvents();
  }

  setState(nextState: UserInputState) {
    this.state = { ...this.state, ...nextState };
    this.render();
  }

  bindEvents() {
    const onClickCarNameBtn = () => {
      const $inputCar = this.$target.querySelector(
        id2Query(ID.InputCarName)
      ) as HTMLInputElement;
      const carNames = $inputCar.value.split(",").map((name) => name.trim());
      if (!carNames.every((name) => this.isValidCarName(name))) {
        alert(AlertMsg.InvalidCarName);
        return;
      }
      this.setState({ isSubmittedCarName: true, carNameVal: $inputCar.value });
    };

    const onClickRaceTimesBtn = () => {
      const $inputTimes = this.$target.querySelector(
        id2Query(ID.InputRaceTimes)
      ) as HTMLInputElement;
      const raceTimes = +$inputTimes.value;
      if (raceTimes < 1) {
        alert(AlertMsg.InvalidTryCnt);
        return;
      }
      this.setState({ isSubmittedRaceTimes: true, raceTimesVal: raceTimes });
    };

    this.$target.addEventListener("click", (e) => {
      const $eventTarget = e.target as HTMLElement;
      if ($eventTarget.matches(id2Query(ID.BtnCarName))) {
        onClickCarNameBtn();
      } else if ($eventTarget.matches(id2Query(ID.BtnRaceTimes))) {
        onClickRaceTimesBtn();
      }
    });
  }

  isValidCarName(carName: string) {
    return carName.length >= 1 && carName.length <= 5;
  }

  getInnerHTML() {
    const state: UserInputState = this.state || defaultState;
    return `
        <form>
          <fieldset>
            <p>
              5자 이하의 자동차 이름을 콤마로 구분하여 입력해주세요. <br />
              예시) EAST, WEST, SOUTH, NORTH
            </p>
            <div class="d-flex">
              <input type="text" 
                ${state.isSubmittedCarName && "disabled"} 
                id=${ID.InputCarName} 
                class="w-100 mr-2" placeholder="자동차 이름" 
                ${state.carNameVal && `value = '${state.carNameVal}' `} />
              <button type="button" 
                ${state.isSubmittedCarName && "disabled"} 
                id=${ID.BtnCarName} class="btn btn-cyan">확인</button>
            </div>
          </fieldset>

          ${
            state.isSubmittedCarName
              ? `
          <fieldset>
            <p>시도할 횟수를 입력해주세요.</p>
            <div class="d-flex">
              <input type="number" 
                ${state.isSubmittedRaceTimes && "disabled"}
                id=${ID.InputRaceTimes} 
                class="w-100 mr-2" placeholder="시도 횟수"
                ${state.raceTimesVal && `value = '${state.raceTimesVal}' `} />
              <button type="button" 
                ${state.isSubmittedRaceTimes && "disabled"} 
                id=${ID.BtnRaceTimes} 
                class="btn btn-cyan">확인</button>
            </div>
          </fieldset>
          `
              : ""
          }
        </form>
    `;
  }
}