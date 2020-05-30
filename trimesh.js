class Trimesh {
  constructor(positions, faces, normals, textureCoordinates) {
    this.positions = positions;
    this.faces = faces;
    this.normals = normals;
    this.textureCoordinates = textureCoordinates;

    this.calculateBounds();
  }

  smoothFaces() {
    // Zero out per-vertex normals.
    this.normals = new Array(this.vertexCount);
    for (let i = 0; i < this.vertexCount; ++i) {
      this.normals[i] = new Vector3(0, 0, 0);
    }

    // Compute face normal. Accumulate to each connected vertex.
    for (let face of this.faces) {
      const ab = this.positions[face[1]].subtract(this.positions[face[0]]);
      const ac = this.positions[face[2]].subtract(this.positions[face[0]]);
      const faceNormal = ab.cross(ac).normalize();
      for (let i = 0; i < 3; ++i) {
        this.normals[face[i]] = this.normals[face[i]].add(faceNormal);
      }
    }

    // Normalize per-vertex normals.
    for (let i = 0; i < this.vertexCount; ++i) {
      if (this.normals[i].magnitude > 0) {
        this.normals[i] = this.normals[i].normalize();
      }
    }
  }

  separateFaces() {
    const oldPositions = this.positions;

    this.positions = new Array(this.faceCount * 3);
    this.normals = new Array(this.faceCount * 3);

    // Compute face normal. Accumulate to each connected vertex.
    let vertexIndex = 0;
    for (let face of this.faces) {
      const ab = oldPositions[face[1]].subtract(oldPositions[face[0]]);
      const ac = oldPositions[face[2]].subtract(oldPositions[face[0]]);
      const faceNormal = ab.cross(ac).normalize();
      for (let i = 0; i < 3; ++i) {
        this.positions[vertexIndex] = oldPositions[face[i]].clone();
        this.normals[vertexIndex] = faceNormal;
        face[i] = vertexIndex;
        ++vertexIndex;
      }
    }
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
