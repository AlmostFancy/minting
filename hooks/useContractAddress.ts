const useContractAddress = (): string => {
    return process.env.NODE_ENV === 'production' ? '0x8Dc1c7571aC722871a76a0b4949847bB4bFAD28C' : '0xA8e7d48350E8CBf354B4b2e2D7247c394F770863';
}

export default useContractAddress;