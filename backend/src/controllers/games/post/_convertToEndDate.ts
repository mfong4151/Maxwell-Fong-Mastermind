//Made specifically because prisma only accepts iso strings as inputs
export const _convertToEndDate = (numTime: number): string =>{
    const now = new Date();
    const endDate = new Date(now.getTime() + numTime);
    
    return endDate.toISOString();
} ;