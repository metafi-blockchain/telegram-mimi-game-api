interface IVotingOption {
  value: number;
  text: string;
  order?: number
}

interface IVotingOptions {
    items: Array<IVotingOption>;
  }