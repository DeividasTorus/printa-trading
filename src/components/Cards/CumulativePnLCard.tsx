import React, { useState } from 'react';
import Modal from '../Modals/BalanceModal'; // adjust path as needed

export default function CumulativePnLCard() {
  const [showModal, setShowModal] = useState(false);
  const [startingBalance, setStartingBalance] = useState('');
  const [drawdownBalance, setDrawdownBalance] = useState('');

  const handleSave = () => {
    console.log('Saved:', { startingBalance, drawdownBalance });
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-white text-center p-6 rounded-xl flex flex-col items-center justify-center h-full">
        <p className="text-[24px] font-semibold mb-4 leading-[30px] max-w-[300px]">
          For calculating cumulative PnL, please provide your starting balance
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#480090] text-white rounded-lg px-12 py-2 hover:bg-purple-700"
        >
          Set Balance
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Please provide your starting balance`}
        footer={
          <button
            onClick={handleSave}
            className="w-full bg-[#480090] text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Save
          </button>
        }
      >
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Starting Balance
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Set Your Balance"
            value={startingBalance}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setStartingBalance(value);
              }
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Drawdown Balance
          </label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="Set Your Drawdown Balance"
            value={drawdownBalance}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setDrawdownBalance(value);
              }
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>
      </Modal>
    </>
  );
}
