// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swappy is ERC721, Ownable {
    event Burn(uint256);
    event Mint(address, uint256);

    error Unauthorized();

    uint256 public tokenId;
    string public baseURI;

    constructor() ERC721("Swappy", "Swappy") Ownable(msg.sender) {
        tokenId = 0;
    }

    function mint(address _to) public onlyOwner {
        _mint(_to, tokenId);
        emit Mint(_to, tokenId);
        tokenId++;
    }

    function batchMint(address[] calldata _to) public onlyOwner {
        for (uint256 i; i < _to.length; ) {
            _mint(_to[i], tokenId + i);
            emit Mint(_to[i], tokenId + i);
            unchecked {
                ++i;
            }
        }
        tokenId += _to.length;
    }

    function burn(uint256 _tokenId) public {
        if (ownerOf(_tokenId) != msg.sender) revert Unauthorized();
        _burn(_tokenId);
        emit Burn(_tokenId);
    }

    function batchBurn(uint256[] calldata _tokenIds) public {
        for (uint256 i; i < _tokenIds.length; ) {
            uint256 _burnId = _tokenIds[i];
            if (ownerOf(_burnId) != msg.sender) revert Unauthorized();
            _burn(_burnId);
            emit Burn(_burnId);
            unchecked {
                ++i;
            }
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata _updateBaseURI) external onlyOwner {
        baseURI = _updateBaseURI;
    }
}
