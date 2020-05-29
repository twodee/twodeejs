class Trimesh {
  constructor(positions, faces, normals, textureCoordinates) {
    this.positions = positions;
    this.faces = faces;
    this.normals = normals;
    this.textureCoordinates = textureCoordinates;

    this.calculateBounds();
  }

  calculateBounds() {
    if (this.vertexCount > 0) {
      this.minimumPosition = this.positions[0].clone();
      this.maximumPosition = this.positions[0].clone();
    } else {
      this.minimumPosition = new Vector3(0, 0, 0);
      this.maximumPosition = new Vector3(0, 0, 0);
    }

    for (let position of this.positions) {
      if (position.x < this.minimumPosition.x) {
        this.minimumPosition.x = position.x;
      } else if (position.x > this.maximumPosition.x) {
        this.maximumPosition.x = position.x;
      }

      if (position.y < this.minimumPosition.y) {
        this.minimumPosition.y = position.y;
      } else if (position.y > this.maximumPosition.y) {
        this.maximumPosition.y = position.y;
      }

      if (position.z < this.minimumPosition.z) {
        this.minimumPosition.z = position.z;
      } else if (position.z > this.maximumPosition.z) {
        this.maximumPosition.z = position.z;
      }
    }

    this.centroid = this.minimumPosition.add(this.maximumPosition).scalarMultiply(0.5);
  }

  getFlatPositions() {
    const flat = [];
    for (let position of this.positions) {
      flat.push(position.x);
      flat.push(position.y);
      flat.push(position.z);
      flat.push(1);
    }
    return flat;
  }

  getFlatNormals() {
    const flat = [];
    for (let normal of this.normals) {
      flat.push(normal.x);
      flat.push(normal.y);
      flat.push(normal.z);
      flat.push(0);
    }
    return flat;
  }

  getFlatFaces() {
    return this.faces.flat();
  }

  get vertexCount() {
    return this.positions.length;
  }

  get faceCount() {
    return this.faces.length;
  }
}