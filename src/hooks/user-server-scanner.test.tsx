import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import { ServerScannerProvider } from "../context/ServerScanner"
import useServerScanner from "./use-server-scanner";
import { Wrapper, API_KEY } from "./Wrapper";

const QUERY_PORT = "81223";
const HOST = "12.99.192.122";

type RenderServerScannerHook = {
  mockFetch: Function
}

function renderServerScannerHook({ mockFetch }: RenderServerScannerHook) {
  const { result } = renderHook(
    () => useServerScanner({ host: HOST, queryPort: QUERY_PORT, customFetch: mockFetch }),
    { 
      wrapper: Wrapper,
    },
  );

  return result;
};

const mockData = {
  "name": "Valheim 2",
  "map": "VRisingWorld",
  "password": false,
  "maxplayers": 10,
  "players": [],
  "bots": [],
  "connect": "92.38.148.199:28200",
  "ping": 187
};

const mockError = {
  message: "Unauthorized"
};

describe("useServerScanner hook", () => {
  it('returns the correct data on successful query', () => {
    
    const mockFetch = jest.fn(({ onResponse }) => { onResponse(mockData); });
  
    const result = renderServerScannerHook({ mockFetch });
  
    expect(result.current.data).toStrictEqual(expect.objectContaining(mockData));
  });

  it('returns the correct error message', () => {
    const mockFetch = jest.fn(({ onResponse }) => { onResponse(mockError); });
  
    const result = renderServerScannerHook({ mockFetch });
  
    expect(result.current.error).toBe(mockError.message);
  });

  it('passes the correct arguments to customFetch', () => {
    const mockFetch = jest.fn(({ onResponse }) => { onResponse(mockData); });
  
    const result = renderServerScannerHook({ mockFetch });
  
    expect(mockFetch.mock.calls[0][0].host).toBe(HOST);
    expect(mockFetch.mock.calls[0][0].queryPort).toBe(QUERY_PORT);
    expect(mockFetch.mock.calls[0][0].apiKey).toBe(API_KEY);
  });
});
