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
      <div className="bg-white text-center p-6 rounded shadow flex flex-col items-center justify-center h-full">
        <p className="text-xl font-bold text-gray-600 mb-4 max-w-xs">
          For calculating cumulative PnL, please provide your starting balance
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white rounded-lg px-4 py-2"
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
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
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
            type="number"
            placeholder="Set your Price"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Drawdown Balance
          </label>
          <input
            type="number"
            placeholder="Set your Price"
            value={drawdownBalance}
            onChange={(e) => setDrawdownBalance(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>
      </Modal>
    </>
  );
}
