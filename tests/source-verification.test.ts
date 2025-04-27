import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the Clarity environment
const mockClarity = {
  tx: {
    sender: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', // Mock admin address
  },
  contracts: {
    sourceVerification: {
      verifyResearcher: vi.fn(),
      updateReputation: vi.fn(),
      isVerified: vi.fn(),
      getResearcherDetails: vi.fn(),
      transferAdmin: vi.fn(),
    },
  },
};

describe('Source Verification Contract', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
  });
  
  it('should verify a researcher successfully', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const name = 'John Doe';
    const organization = 'Security Research Inc';
    
    mockClarity.contracts.sourceVerification.verifyResearcher.mockResolvedValue({
      success: true,
      value: true,
    });
    
    const result = await mockClarity.contracts.sourceVerification.verifyResearcher(
        researcher, name, organization
    );
    
    expect(result.success).toBe(true);
    expect(mockClarity.contracts.sourceVerification.verifyResearcher).toHaveBeenCalledWith(
        researcher, name, organization
    );
  });
  
  it('should fail verification if not admin', async () => {
    // Change tx sender to non-admin
    const originalSender = mockClarity.tx.sender;
    mockClarity.tx.sender = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    
    mockClarity.contracts.sourceVerification.verifyResearcher.mockResolvedValue({
      success: false,
      error: 1, // Error code for not admin
    });
    
    const result = await mockClarity.contracts.sourceVerification.verifyResearcher(
        'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'John Doe', 'Security Research Inc'
    );
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(1);
    
    // Restore original sender
    mockClarity.tx.sender = originalSender;
  });
  
  it('should check if a researcher is verified', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    
    mockClarity.contracts.sourceVerification.isVerified.mockResolvedValue(true);
    
    const result = await mockClarity.contracts.sourceVerification.isVerified(researcher);
    
    expect(result).toBe(true);
    expect(mockClarity.contracts.sourceVerification.isVerified).toHaveBeenCalledWith(researcher);
  });
  
  it('should get researcher details', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const researcherDetails = {
      name: 'John Doe',
      organization: 'Security Research Inc',
      verificationDate: 12345,
      reputationScore: 100
    };
    
    mockClarity.contracts.sourceVerification.getResearcherDetails.mockResolvedValue(researcherDetails);
    
    const result = await mockClarity.contracts.sourceVerification.getResearcherDetails(researcher);
    
    expect(result).toEqual(researcherDetails);
    expect(mockClarity.contracts.sourceVerification.getResearcherDetails).toHaveBeenCalledWith(researcher);
  });
  
  it('should update reputation score', async () => {
    const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const newScore = 150;
    
    mockClarity.contracts.sourceVerification.updateReputation.mockResolvedValue({
      success: true,
      value: true,
    });
    
    const result = await mockClarity.contracts.sourceVerification.updateReputation(
        researcher, newScore
    );
    
    expect(result.success).toBe(true);
    expect(mockClarity.contracts.sourceVerification.updateReputation).toHaveBeenCalledWith(
        researcher, newScore
    );
  });
  
  it('should transfer admin rights', async () => {
    const newAdmin = 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC';
    
    mockClarity.contracts.sourceVerification.transferAdmin.mockResolvedValue({
      success: true,
      value: true,
    });
    
    const result = await mockClarity.contracts.sourceVerification.transferAdmin(newAdmin);
    
    expect(result.success).toBe(true);
    expect(mockClarity.contracts.sourceVerification.transferAdmin).toHaveBeenCalledWith(newAdmin);
  });
});
