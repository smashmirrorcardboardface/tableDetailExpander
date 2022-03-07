import * as React from 'react';

export interface State {
  size: number;
  textLabel: string;
  textValue: string;
}

export const initialState: State = {
  size: 200,
  textLabel: '',
  textValue: '',
};

export class ReactCircleCard extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  render() {
    const { textLabel, textValue, size } = this.state;

    const style: React.CSSProperties = { width: size, height: size };
    return (
      <div className="circleCard" style={style}>
        <p>
          {textLabel}
          <br />
          <em>{textValue}</em>
        </p>
      </div>
    );
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    console.log('update', newState);

    if (typeof ReactCircleCard.updateCallback === 'function') {
      ReactCircleCard.updateCallback(newState);
    }
  }

  public state: State = initialState;

  public componentWillMount() {
    ReactCircleCard.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    ReactCircleCard.updateCallback = null;
  }
}
